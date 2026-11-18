"""Small SVG rasterizer using the system's librsvg and cairo, without a GUI."""
import ctypes as C
import numpy as np
import cv2


class Rasterizer:
    def __init__(self, width=1920, height=1080):
        self.width, self.height = width, height
        self.r = C.CDLL('librsvg-2.so.2')
        self.c = C.CDLL('libcairo.so.2')
        self.g = C.CDLL('libgobject-2.0.so.0')
        def fn(lib, name, args, result):
            f = getattr(lib,name); f.argtypes=args; f.restype=result
        fn(self.r,'rsvg_handle_new_from_data',[C.c_char_p,C.c_size_t,C.c_void_p],C.c_void_p)
        fn(self.r,'rsvg_handle_render_cairo',[C.c_void_p,C.c_void_p],C.c_int)
        fn(self.c,'cairo_image_surface_create',[C.c_int,C.c_int,C.c_int],C.c_void_p)
        fn(self.c,'cairo_create',[C.c_void_p],C.c_void_p)
        fn(self.c,'cairo_scale',[C.c_void_p,C.c_double,C.c_double],None)
        fn(self.c,'cairo_destroy',[C.c_void_p],None)
        fn(self.c,'cairo_surface_destroy',[C.c_void_p],None)
        fn(self.c,'cairo_surface_flush',[C.c_void_p],None)
        fn(self.c,'cairo_image_surface_get_data',[C.c_void_p],C.c_void_p)
        fn(self.c,'cairo_image_surface_get_stride',[C.c_void_p],C.c_int)
        fn(self.g,'g_object_unref',[C.c_void_p],None)

    def render(self, svg):
        data=svg.encode()
        h=self.r.rsvg_handle_new_from_data(data,len(data),None)
        if not h: raise ValueError('Invalid generated SVG')
        surface=self.c.cairo_image_surface_create(0,self.width,self.height)
        ctx=self.c.cairo_create(surface)
        self.c.cairo_scale(ctx,self.width/1920,self.height/1080)
        ok=self.r.rsvg_handle_render_cairo(h,ctx)
        self.c.cairo_surface_flush(surface)
        stride=self.c.cairo_image_surface_get_stride(surface)
        ptr=self.c.cairo_image_surface_get_data(surface)
        a=np.ctypeslib.as_array((C.c_ubyte*(stride*self.height)).from_address(ptr)).reshape(self.height,stride//4,4)[:,:self.width,:3].copy()
        self.c.cairo_destroy(ctx);self.c.cairo_surface_destroy(surface);self.g.g_object_unref(h)
        if not ok: raise RuntimeError('SVG rasterization failed')
        return a
