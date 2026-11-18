from pathlib import Path
import numpy as np
from scipy.optimize import least_squares
# world X forward, Y left; arbitrary origin at closest transverse tape line
rows=[[(1025,832),(1740,838),(300,831)],[(1008,468),(1486,473),(526,463)],[(999,275),(1360,280),(637,271)],[(990,154),(1285,159),(704,153)]]
P=[];uv=[]
for xx,row in enumerate(rows):
 for yy,p in zip([0,-1,1],row):P.append([xx,yy,1]);uv.append(p)
P=np.array(P);uv=np.array(uv)
A=[]
for (X,Y,_),(u,v) in zip(P,uv):
 A.extend([[-X,-Y,-1,0,0,0,u*X,u*Y,u],[0,0,0,-X,-Y,-1,v*X,v*Y,v]])
_,_,vt=np.linalg.svd(A);H=vt[-1].reshape(3,3);H/=H[-1,-1]
print('H',H)
def decomp(f):
 K=np.array([[f,0,960],[0,f,540],[0,0,1.]])
 B=np.linalg.inv(K)@H
 a,b=B[:,0],B[:,1]
 return np.array([np.dot(a,b)/np.linalg.norm(a)/np.linalg.norm(b),np.log(np.linalg.norm(a)/np.linalg.norm(b))])
r=least_squares(lambda q:decomp(np.exp(q[0])),[np.log(1200)])
f=np.exp(r.x[0]);print('f',f,'resid',r.fun)
K=np.array([[f,0,960],[0,f,540],[0,0,1.]])
B=np.linalg.inv(K)@H;B/=np.mean([np.linalg.norm(B[:,0]),np.linalg.norm(B[:,1])]);R=np.column_stack((B[:,0],B[:,1],np.cross(B[:,0],B[:,1])));U,S,V=np.linalg.svd(R);R=U@V
C=-R.T@B[:,2];print('R',R,'C',C,'radii',np.linalg.norm(np.array([3,0,0])-C),np.linalg.norm(np.array([3,-2,0])-C))
print('projection errors', np.round((H@P.T).T[:,:2]/(H@P.T).T[:,2,None]-uv,1))
np.savez(str(Path(__file__).resolve().parent/'grid_calib.npz'),H=H,K=K,R=R,C=C,P=P,uv=uv)
rows10=[[(641,900),(1220,646),(1580,480)],[(493,536),(950,408),(1280,310)],[(419,338),(794,255),(1070,211)],[(362,207),(678,152),(915,114)]]
P10=[];uv10=[]
for xx,row in enumerate(rows10):
 for yy,p in zip([0,-1,-2],row):P10.append([xx,yy,1]);uv10.append(p)
P10=np.array(P10);uv10=np.array(uv10)
A=[]
for (X,Y,_),(u,v) in zip(P10,uv10):
 A.extend([[-X,-Y,-1,0,0,0,u*X,u*Y,u],[0,0,0,-X,-Y,-1,v*X,v*Y,v]])
_,_,vt=np.linalg.svd(A);H10=vt[-1].reshape(3,3);H10/=H10[-1,-1]
B10=np.linalg.inv(K)@H10;B10/=np.mean([np.linalg.norm(B10[:,0]),np.linalg.norm(B10[:,1])]);R10=np.column_stack((B10[:,0],B10[:,1],np.cross(B10[:,0],B10[:,1])));U,S,V=np.linalg.svd(R10);R10=U@V
C10=-R10.T@B10[:,2]
head0=R.T@np.array([0,0,1]);head10=R10.T@np.array([0,0,1]);ang0=np.degrees(np.arctan2(head0[1],head0[0]));ang10=np.degrees(np.arctan2(head10[1],head10[0]));print('C10',C10,'heading0,10,delta',ang0,ang10,ang10-ang0)
print('R10',R10)
print('proj error10', np.round((H10@P10.T).T[:,:2]/(H10@P10.T).T[:,2,None]-uv10,1))
print('source floor10 grid coord',np.linalg.inv(H10)@np.array([880,112,1.]));q=np.linalg.inv(H10)@np.array([880,112,1.]);print('normalized',q/q[2]);np.savez(str(Path(__file__).resolve().parent/'grid_calib10.npz'),H=H10,K=K,R=R10,C=C10,P=P10,uv=uv10)
