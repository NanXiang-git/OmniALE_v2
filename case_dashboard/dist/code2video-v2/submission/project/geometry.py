"""Cubic geometry, arc length sampling and timeline interpolation.

All coordinates are in the 1920 x 1080 design plane. No source pixels are used.
"""
import math
import numpy as np


def clamp(x, a=0., b=1.):
    return max(a, min(b, x))


def smooth(x):
    x = clamp(x)
    return x*x*(3-2*x)


def ease(t, a, b):
    return smooth((t-a)/(b-a)) if b != a else float(t >= b)


def key(t, points):
    """Piecewise linear interpolation; keyframes can contain scalar/vector values."""
    ts = [p[0] for p in points]
    vs = np.asarray([p[1] for p in points], dtype=float)
    if vs.ndim == 1:
        return float(np.interp(t, ts, vs))
    return np.array([np.interp(t, ts, vs[:, i]) for i in range(vs.shape[1])])


class Curve:
    def __init__(self, start, segments, steps=100):
        p = np.array(start, float)
        self.start = p
        self.segments = segments
        pts = [p]
        for c1, c2, end in segments:
            a, b, q = map(lambda x: np.array(x, float), (c1, c2, end))
            u = np.linspace(0, 1, steps+1)[1:, None]
            pts.extend((1-u)**3*p + 3*(1-u)**2*u*a + 3*(1-u)*u**2*b + u**3*q)
            p = q
        self.points = np.array(pts)
        self.lengths = np.r_[0, np.cumsum(np.linalg.norm(np.diff(self.points, axis=0), axis=1))]
        self.length = self.lengths[-1]
        tangent = np.gradient(self.points, axis=0)
        self.tangent = tangent / np.linalg.norm(tangent, axis=1)[:, None]

    def at(self, distance):
        d = np.asarray(distance)
        p = np.stack([np.interp(d, self.lengths, self.points[:, i]) for i in range(2)], axis=-1)
        v = np.stack([np.interp(d, self.lengths, self.tangent[:, i]) for i in range(2)], axis=-1)
        return p, v

    def svg(self):
        s = f'M{self.start[0]:.3f},{self.start[1]:.3f}'
        for a,b,c in self.segments:
            s += f'C{a[0]},{a[1]} {b[0]},{b[1]} {c[0]},{c[1]}'
        return s

    def part(self, start=0., end=1., spacing=3):
        a, b = clamp(start)*self.length, clamp(end)*self.length
        if b <= a: return ''
        ds = np.linspace(a, b, max(2, int((b-a)/spacing)))
        p, _ = self.at(ds)
        return 'M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in p)

    def offset_part(self, start=0, end=1, offset=0):
        ds = np.linspace(start*self.length, end*self.length, max(2, int((end-start)*self.length/3)))
        p, v = self.at(ds)
        p += np.stack([-v[:,1],v[:,0]],axis=-1)*offset
        return 'M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in p)


# Print and UI mark share the same circle radius and diagonal.
RIGHT = Curve((758, 583), [
    ((820,645),(877,712),(937,752)),
    ((995,794),(1060,812),(1127,800)),
    ((1260,777),(1346,666),(1346,540)),
    ((1346,393),(1228,274),(1080,274)),
    ((1026,274),(979,290),(938,317)),
])
LEFT = Curve((1020,544), [
    ((936,461),(878,384),(786,384)),
    ((665,373),(566,470),(566,595)),
    ((566,714),(664,804),(786,804)),
])
# The illustrated lower tail is a pointed ribbon rather than a round cap.
LEFT_ILL = Curve((1020,544), [
    ((937,459),(875,384),(786,384)),
    ((665,373),(566,470),(566,595)),
    ((566,714),(685,802),(786,804)),
    ((834,819),(878,838),(917,849)),
])


def circle_arc(cx,cy,r,a,b):
    q = np.linspace(math.radians(a), math.radians(b), max(2,int(abs(b-a)*2)))
    return 'M'+'L'.join(f'{cx+r*math.cos(x):.2f},{cy+r*math.sin(x):.2f}' for x in q)


def ribbon_outline(curve, end=1., width=90, taper_start=.87):
    """Closed ink outline with a round origin and a pointed final tail."""
    end=clamp(end)
    ds=np.linspace(0,end*curve.length,max(2,int(end*curve.length/3)))
    p,v=curve.at(ds)
    n=np.stack([-v[:,1],v[:,0]],axis=-1)
    w=width/2*np.minimum(1,(curve.length-ds)/((1-taper_start)*curve.length))
    aa=p+n*w[:,None];bb=p-n*w[:,None]
    s='M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in aa)
    # Round advancing cap, tapering to zero only at the final point.
    theta=math.atan2(v[-1,1],v[-1,0])
    for a in np.linspace(theta+math.pi/2,theta-math.pi/2,14):
        x,y=p[-1]+w[-1]*np.array([math.cos(a),math.sin(a)])
        s+=f'L{x:.2f},{y:.2f}'
    s+='L'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in bb[::-1])
    theta=math.atan2(v[0,1],v[0,0])
    for a in np.linspace(theta-math.pi/2,theta-3*math.pi/2,14):
        x,y=p[0]+w[0]*np.array([math.cos(a),math.sin(a)])
        s+=f'L{x:.2f},{y:.2f}'
    return s+'Z'
