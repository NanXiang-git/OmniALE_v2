import numpy as np,json
from scipy.optimize import least_squares
from PIL import Image,ImageDraw
# Grid coordinates: horizontal right, depth toward far row; unit grid squares.
p0=np.array([[[-1,4],[695,153]],[[0,4],[992,158]],[[1,4],[1288,160]],[[2,4],[1587,163]],[[-1,3],[626,271]],[[0,3],[997,279]],[[1,3],[1374,285]],[[2,3],[1755,291]],[[-1,2],[502,455]],[[0,2],[1008,465]],[[1,2],[1510,476]],[[-1,1],[257,827]],[[0,1],[1025,837]],[[1,1],[1750,846]]])
p1=np.array([[[0,4],[360,210]],[[1,4],[920,125]],[[2,4],[1305,65]],[[0,3],[407,335]],[[1,3],[1060,209]],[[2,3],[1470,127]],[[0,2],[493,533]],[[1,2],[1278,321]],[[2,2],[1740,198]],[[0,1],[650,901]],[[1,1],[1575,499]]])
p1[:,0,0] *= 2
def homography(p):
 A=[]
 for (x,y),(u,v) in p:
  A.extend([[-x,-y,-1,0,0,0,u*x,u*y,u],[0,0,0,-x,-y,-1,v*x,v*y,v]])
 u,s,v=np.linalg.svd(A);H=v[-1].reshape(3,3);H/=H[2,2];return H
Hs=[homography(p) for p in [p0,p1]]
for i,(H,p) in enumerate(zip(Hs,[p0,p1])):
 print('H',i,H)
 v1=H[:,0]/H[2,0];v2=H[:,1]/H[2,1];print('vanishing',v1,v2)
 cx,cy=960,540
 f2=-np.dot(v1[:2]-[cx,cy],v2[:2]-[cx,cy]);print('f',np.sqrt(max(0,f2)))
 im=Image.open(['/workspace/analysis/frame_0.jpg','/workspace/analysis/frame_18.jpg'][i]);d=ImageDraw.Draw(im)
 for xy,uv in p:
  u,v=uv;d.ellipse((u-6,v-6,u+6,v+6),outline='red',width=3);d.text((u+10,v),str(xy),fill='red')
 im.resize((1280,720)).save(f'/workspace/analysis/grid{i}.jpg')
# Common camera matrix with center fixed; enforce equal orthogonal homography axes.
def residual(par):
 fx,fy,cx,cy=par
 K=np.array([[fx,0,cx],[0,fy,cy],[0,0,1]])
 r=[]
 for H in Hs:
  a=np.linalg.solve(K,H[:,0]);b=np.linalg.solve(K,H[:,1]);r.extend([np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b)),np.log(np.linalg.norm(a)/np.linalg.norm(b))])
 return r
fit=least_squares(lambda p:residual([p[0],p[0],960,540]),[1400],bounds=([300],[5000]));print('square intrinsic f',fit.x, 'resid',fit.fun)
f=fit.x[0];K=np.array([[f,0,960],[0,f,540],[0,0,1]])
Rs=[]
for H in Hs:
 a,b,c=np.linalg.solve(K,H).T
 scale=(np.linalg.norm(a)+np.linalg.norm(b))/2
 R=np.array([a/np.linalg.norm(a),b/np.linalg.norm(b),np.cross(a,b)/np.linalg.norm(np.cross(a,b))]).T
 U,sv,V=np.linalg.svd(R);R=U@V
 C=-R.T@(c/scale);Rs.append(R);print('camera grid coordinate',C,'forward horiz',R[2,:2], 'yaw right',np.degrees(np.arctan2(R[2,0],R[2,1])))
print('angular difference right',np.degrees(np.arctan2(Rs[1][2,0],Rs[1][2,1]))-np.degrees(np.arctan2(Rs[0][2,0],Rs[0][2,1])) )
json.dump({'grid_points_initial':p0.tolist(),'grid_points_final':p1.tolist(),'homographies':[h.tolist() for h in Hs],'focal_length_px':f,'fit_residual':fit.fun.tolist()},open('/workspace/analysis/geometry.json','w'),indent=2)
