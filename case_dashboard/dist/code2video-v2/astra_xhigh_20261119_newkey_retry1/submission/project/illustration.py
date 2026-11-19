"""Independently animated, hand-authored illustration elements and curved typography."""
import math
from .graphics import *
from .geometry import *
from .lettering import text_on_path
INK='#141313'
PINK=linear(520,430,1370,700,'#FF00E9','#FF007B','#FF003D')
OBJECTS=[]
def obj(name,start,duration,pivot,shapes,layer=0,peel=False):
    OBJECTS.append(dict(name=name,start=start,duration=duration,pivot=pivot,shapes=shapes,layer=layer,peel=peel))
def shape(d,fill,stroke=INK,width=1.3):return dict(d=d,fill=fill,stroke=stroke,width=width)
def ln(d,col=INK,width=1.2):return shape(d,None,col,width)

# Back flowers and foliage. These are separate silhouettes, not a single illustration plate.
obj('red_scalloped_flower',67,6,(1220,729),[
shape('M1050 714 C1005 663 1027 607 1080 616 C1100 548 1160 565 1188 597 C1222 533 1270 557 1288 600 C1346 542 1392 583 1376 624 C1448 592 1494 643 1465 688 C1520 716 1490 774 1442 782 C1482 839 1416 879 1374 859 C1373 929 1304 935 1268 880 C1229 942 1163 918 1169 869 C1113 907 1065 865 1082 815 C1003 831 1002 771 1050 748 Z',linear(1030,600,1460,860,'#FF00E8','#FF0053','#FF0026'))],0)
obj('lower_lime_burst',75,6,(1245,911),[
shape('M1245 861 L1251 900 L1301 882 L1273 914 L1313 927 L1270 931 L1287 974 L1253 943 L1236 990 L1228 943 L1181 961 L1217 924 L1181 905 L1226 904 Z','#c6f944')],0)
obj('lime_crown',74,5,(1017,300),[
shape('M841 155 L970 217 L1018 82 L1065 217 L1175 163 L1128 296 L921 341 Z',linear(930,150,1050,360,'#82D300','#97e900')),
ln('M878 193 L974 243 M1008 165 L1019 136 L1045 212 M1105 218 L1150 196')],0)
obj('lightning_leaf',72,6,(1040,379),[
shape('M765 333 L934 277 L1049 286 L1192 334 L1143 373 L1174 437 L1065 450 L1049 495 L970 447 L840 507 L873 428 Z',{'linear':[935,458,1082,280],'stops':[(0,'#329eff'),(.55,'#4b9db7'),(1,'#8bd600')]}),
ln('M818 333 L851 323 M1152 353 L1126 344')],1,True)
obj('right_lime_leaf',70,6,(1242,504),[
shape('M1166 474 C1171 401 1272 376 1317 418 C1372 473 1367 533 1321 585 L1210 582 Z',linear(1153,452,1364,540,'#d9ff00','#7fce2a'))],1,True)
obj('left_magenta_star',73,2,(492,665),[
shape('M469 548 L502 608 L546 572 L546 629 L606 645 L552 676 L584 723 L520 715 L467 768 L463 708 L383 694 L438 655 L398 605 L461 622 Z',linear(410,660,582,660,'#f500d6','#ff0054'))],1)
obj('pencil',79,5,(595,356),[
shape('M487 451 L532 349 L662 261 C674 254 681 259 690 271 L718 317 C725 330 721 339 709 346 L579 435 Z','#fff',INK,1.5),
shape('M499 438 L540 356 L668 267 C674 264 678 266 683 276 L710 321 C716 332 711 337 702 341 L574 426 Z','#ffcc14'),
shape('M500 437 L525 384 L558 427 Z','#ff9e00'),
shape('M500 437 L511 411 L524 432 Z','#080a09'),
shape('M620 299 L640 287 L680 356 L657 372 Z','#ff9d00'),
shape('M540 356 L619 301 L631 322 L554 377 C536 387 533 371 540 356 Z',linear(540,348,627,367,'#fff529','#ff9c00')),
shape('M554 377 L631 322 L643 343 L568 396 C550 409 539 391 554 377 Z','#ffc219'),
shape('M568 396 L643 343 L657 370 L580 422 C566 432 552 410 568 396 Z','#ffc51e')],2)
obj('camera_capsule',75,3,(548,751),[
shape('M469 752 L582 671 C603 657 633 681 650 711 C667 741 650 760 633 772 L520 849 C485 871 420 791 469 752 Z','#fff',INK,2.5),
shape('M474 755 L583 680 C606 664 654 723 630 747 L515 834 C487 853 436 788 474 755 Z',linear(465,792,600,716,'#42bbd1','#26a5ed','#9bdc55')),
shape('M477 759 C505 744 547 799 523 825 C493 850 447 783 477 759 Z','#6cde6c'),
ln('M483 768 C509 758 534 798 517 816 C495 832 459 784 483 768 Z'),
ln('M483 768 C476 787 495 811 517 816 M491 766 C484 786 505 803 522 805 M501 770 C495 786 510 796 524 795')],2)
obj('yellow_plus',74,4,(526,695),[
shape('M505 664 C503 627 544 628 546 662 L547 679 L563 677 C600 674 599 714 566 718 L550 720 L550 735 C549 767 511 764 508 736 L507 720 L485 720 C456 720 458 677 486 676 L505 676 Z',linear(473,712,558,652,'#feff00','#ffd683','#faadad'))],3)
obj('seal_chain',73,3,(650,846),[
shape('M593 809 L611 794 L630 798 L647 786 L664 794 L684 794 L691 814 L712 824 L709 846 L720 863 L704 881 L702 898 L682 904 L665 920 L646 911 L625 911 L614 894 L594 888 L594 868 L584 852 Z',linear(598,810,699,900,'#ff00cf','#ff0018')),
shape('M626 867 C593 837 615 805 643 820 C658 827 672 851 660 855 C650 861 645 826 631 831 C611 839 635 870 651 875 C677 885 694 866 677 849 L664 835 C655 826 663 821 670 828 C721 872 676 916 638 881 Z','#ffa500')],2)
obj('yellow_feather',62,4,(822,770),[
shape('M735 733 C697 682 670 650 695 727 L718 777 C659 688 673 744 703 806 C734 867 787 950 807 949 C829 948 805 899 797 876 C853 954 882 934 858 881 C921 956 961 909 928 851 C996 907 1030 869 973 813 C927 748 876 657 847 660 C826 661 866 740 879 762 C824 704 798 679 801 709 L819 748 C750 671 711 656 735 733 Z',linear(794,661,826,921,'#a2d925','#ffff00','#fcff00'))],3,True)
obj('inner_green_leaf',62,4,(901,709),[
shape('M851 643 C851 568 889 582 927 619 C962 658 1001 724 1001 775 C1007 808 976 798 958 777 C961 828 936 835 919 805 C928 850 898 847 880 807 C867 775 832 699 851 643 Z',linear(890,595,1006,807,'#98d538','#d7fc12'))],2)
obj('lavender_inner',66,3,(712,570),[
shape('M552 623 C550 537 611 447 683 426 C732 408 801 439 827 488 C868 572 827 660 767 696 C690 744 552 742 552 659 Z',radial(625,608,247,'#c24bff','#a293ff','#bc84e8'))],4,True)
obj('pink_center_blob',65,5,(1132,643),[
shape('M987 608 C947 577 990 543 1032 556 C1062 517 1081 468 1118 496 C1152 516 1174 548 1191 554 C1220 487 1287 484 1291 551 C1320 543 1334 591 1309 623 C1296 665 1278 695 1238 731 C1177 790 1101 774 1046 758 C990 748 961 716 946 690 C928 653 950 621 987 608 Z',linear(945,616,1308,661,'#fa00f5','#ff00bb','#ff005c'))],5,True)
obj('blue_orb',73,2,(1170,565),[
shape('M1073 555 C1082 494 1146 450 1206 470 C1259 485 1283 545 1261 599 C1245 640 1207 666 1169 665 C1106 666 1060 611 1073 555 Z',{'linear':[1121,487,1262,646],'stops':[(0,'#a99aff'),(.44,'#9d9bfc'),(.75,'#20b5ec'),(1,'#b5e231')]}),
ln('M1168 549 C1178 520 1213 495 1271 482 C1289 479 1308 481 1326 485 M1176 538 C1186 514 1179 499 1170 489 M1169 550 C1191 536 1214 541 1223 566', '#514476',1.2)],6)
obj('mushroom_cap',78,4,(1235,169),[
shape('M1154 157 C1168 139 1173 102 1194 93 C1225 78 1246 90 1260 105 C1281 126 1315 124 1310 155 C1306 188 1258 211 1223 209 C1169 205 1142 184 1154 157 Z',linear(1158,169,1296,119,'#ffb8d5','#9187d1','#29b5f7')),
shape('M1167 176 C1178 144 1247 126 1284 146 C1312 159 1284 201 1234 208 C1193 211 1164 202 1167 176 Z',linear(1160,177,1290,190,'#188dfe','#e600ff','#4097f0')),
shape('M1214 228 C1213 207 1219 188 1219 166 C1217 151 1229 145 1237 156 L1265 215 C1271 231 1264 239 1248 241 C1228 243 1213 237 1214 228 Z',linear(1217,209,1269,212,'#e491cf','#af95d4','#359bfa')),
ln('M1222 212 L1258 209')],5)
obj('upper_lime_flower',76,4,(1334,268),[
shape('M1267 247 C1232 219 1253 190 1288 210 C1301 178 1328 182 1335 213 C1353 183 1382 190 1379 222 C1415 207 1448 241 1410 260 C1446 282 1428 315 1391 304 C1391 338 1355 345 1340 315 C1321 351 1292 333 1294 308 C1263 325 1238 307 1258 281 C1226 274 1237 250 1267 247 Z','#fff',INK,1.1),
shape('M1273 248 C1247 224 1262 203 1288 222 C1303 193 1323 197 1333 229 C1354 200 1371 204 1368 234 C1401 218 1427 241 1395 261 C1425 282 1414 306 1380 293 C1380 324 1357 333 1341 301 C1321 334 1302 320 1304 293 C1273 311 1256 296 1275 276 C1245 268 1250 255 1273 248 Z',linear(1257,256,1410,273,'#f0e753','#9bea39','#ff9d10'))],5)
obj('aqua_star',80,5,(1392,190),[
shape('M1340 143 L1370 167 L1350 169 L1373 186 L1368 210 L1390 202 L1403 228 L1405 201 L1434 222 L1419 197 L1439 192 L1416 183 L1412 163 L1400 175 L1380 150 L1385 174 Z',linear(1362,170,1434,221,'#b9e996','#2b9ca9'))],4)
obj('cherry_and_stem',77,4,(1450,346),[
shape('M1404 386 C1376 361 1385 318 1412 298 C1434 278 1467 293 1493 324 C1521 350 1499 386 1472 403 C1441 415 1425 402 1404 386 Z',linear(1398,318,1507,383,'#ff00f5','#ff0030')),
shape('M1450 340 C1476 302 1515 292 1563 316 L1554 326 C1504 301 1472 327 1450 340 Z','#ff0065'),
ln('M1450 340 C1461 341 1477 354 1478 368 M1450 340 L1457 315')],5)
obj('right_arrow',79,3,(1468,438),[
shape('M1394 458 L1443 364 L1498 348 L1462 421 L1533 405 L1543 444 L1478 461 L1537 503 L1484 514 Z','#fff',INK,2),
shape('M1406 454 L1449 374 L1484 362 L1445 438 L1525 418 L1532 436 L1456 458 L1518 498 L1486 504 Z',linear(1406,440,1530,456,'#7ecd26','#e5ff13'),INK,1.4)],6)
obj('eye_coin',77,3,(1442,636),[
shape('M1362 592 C1393 528 1463 527 1508 573 C1553 617 1544 684 1493 715 C1458 739 1394 728 1365 686 C1341 653 1341 626 1362 592 Z','#050505',None),
shape('M1357 585 C1387 527 1459 523 1503 569 C1547 612 1540 680 1489 710 C1452 732 1392 719 1363 680 C1340 646 1340 616 1357 585 Z','#fff',INK,1.2),
shape('M1367 590 C1394 539 1456 537 1495 578 C1534 617 1528 674 1482 701 C1447 721 1398 708 1374 673 C1351 643 1352 616 1367 590 Z','#ff9a00'),
shape('M1362 599 C1412 574 1480 592 1520 664 C1464 689 1404 668 1362 599 Z',None,INK,1.3),
shape('M1406 606 C1447 567 1502 623 1464 661 C1426 695 1378 646 1406 606 Z',None,INK,1.2)],9)
obj('left_ribbon',79,3,(423,508),[
shape('M308 510 C329 453 383 424 421 452 C467 484 471 540 440 558 C406 577 367 544 380 509 C393 475 428 460 459 464 C484 466 512 492 525 520 C531 536 515 545 506 530 C489 499 468 484 449 485 C427 480 402 502 403 521 C403 542 424 545 433 528 C442 511 427 478 405 469 C376 453 338 479 330 514 C325 530 303 529 308 510 Z',linear(310,479,525,530,'#f300e8','#ff00b4','#ff001b'))],4)
obj('bottom_orbit',74,4,(1360,829),[
shape('M1251 809 C1366 883 1521 865 1470 740 L1480 734 C1547 876 1352 909 1247 821 Z','#ffff00'),
shape('M1265 814 L1463 894 L1459 901 L1260 822 Z',linear(1270,820,1463,894,'#fff700','#78ca87')),
shape('M1441 723 L1458 704 L1484 728 L1466 746 Z',linear(1444,714,1483,739,'#45ca85','#269edf')),
shape('M1290 825 L1316 811 L1334 837 L1307 852 Z',linear(1292,819,1326,850,'#76d894','#209dbd')),
shape('M1452 892 C1460 878 1477 889 1469 903 C1462 913 1450 908 1452 892 Z',linear(1452,892,1472,909,'#88d57d','#20acd1')),
shape('M1503 763 C1512 754 1526 772 1518 782 C1507 793 1497 774 1503 763 Z',linear(1503,762,1520,785,'#9de25f','#16abbe'))],3)
obj('lower_curl',80,6,(471,882),[
shape('M462 849 C500 826 529 853 517 878 C503 908 472 909 457 893 C450 928 483 943 513 933 C528 929 528 941 518 947 C468 968 425 927 441 887 C446 873 450 866 461 860 C450 863 445 856 462 849 Z M464 880 C474 894 494 895 501 881 C509 864 481 856 464 880 Z',linear(440,885,526,903,'#ffc621','#b7e756','#ffe53c'))],5)
obj('green_diamond',80,5,(415,825),[
shape('M406 785 L449 821 L423 860 L382 823 Z',linear(382,820,449,826,'#dae755','#6ccb3c'))],4)
obj('pink_top_spark',86,6,(1007,99),[
shape('M1007 70 L1013 87 L1029 79 L1020 95 L1035 104 L1017 107 L1018 124 L1005 113 L994 126 L995 108 L977 106 L995 98 L984 84 L1002 90 Z','#fa00e2',None)],7)
obj('lower_confetti',84,5,(363,849),[
shape('M335 813 L375 842 L350 878 L307 850 Z',linear(310,833,374,865,'#ff00a1','#f800d9')),
shape('M352 834 C366 805 378 801 390 814 L406 830 C412 838 398 857 390 863 C381 872 367 854 352 848 Z',linear(350,831,404,850,'#5ab0ed','#ae8bdc')),
shape('M395 818 C403 804 423 811 425 827 C427 847 405 850 396 838 C391 832 392 824 395 818 Z',linear(393,816,425,839,'#e1f917','#93d233'))],5)

# Foreground drawn sparks are deliberately independent from the tubes.
obj('white_lower_spark',77,5,(768,750),[
shape('M767 693 C779 733 782 747 832 751 C780 756 778 764 771 803 C762 765 751 762 707 762 C753 752 758 743 767 693 Z','#fff',INK,1)],10)
obj('white_top_spark',80,5,(915,267),[
shape('M914 180 C925 240 923 252 973 262 C926 270 917 282 901 334 C908 274 879 260 827 249 C881 255 913 251 914 180 Z','#fff',INK,1.1)],8)

def render_object(ctx,o,f):
    p=ease(f,o['start'],o['start']+o['duration'])
    if p<=0:return
    x,y=o['pivot'];ctx.save()
    # Each ornament unfurls about its attachment point and settles with a small overshoot.
    overshoot=1+.055*math.sin(math.pi*p)*math.sin(2*math.pi*p)
    sc=max(.015,p)*overshoot
    exits={'lime_crown':(90,94),'upper_lime_flower':(91,95),'aqua_star':(92,96),'pink_top_spark':(91,94)}
    if o['name'] in exits:
        ex=smooth(f,*exits[o['name']]);sc*=max(.001,1-ex)
    angle=(1-p)*(.20 if o['layer']%2 else -.24)
    ctx.translate(x,y);ctx.rotate(angle);ctx.scale(sc,sc);ctx.translate(-x,-y)
    if o['name']=='mushroom_cap' and f>91:
        yy=240-77*smooth(f,91,96);ctx.rectangle(1100,50,260,yy-50);ctx.clip()
    if o['name']=='blue_orb' and f>90:
        pp=smooth(f,90,96);yy=450+78*pp
        poly(ctx,[(1040,yy),(1330,yy+100*pp),(1350,750),(1030,750)]);ctx.clip()
    for sh in o['shapes']:draw(ctx,sh['d'],sh['fill'],sh['stroke'],sh['width'])
    ctx.restore()

def colored_band(ctx,d,a,b,width=90):
    if b<=a:return
    ctx.save();ctx.translate(7,9);stroke(ctx,d,'#000000',width+7,a,b);ctx.restore()
    stroke(ctx,d,INK,width+2,a,b);stroke(ctx,d,PINK,width,a,b)
    # Inked, curved ribbon divisions remain editable under the heavy lettering.
    ctx.save();p=segment(d,a,b)
    line(ctx,p,'#fff',width-1);ctx.stroke() if False else None
    ctx.restore()
    stroke(ctx,d,PINK,width,a,b)
    for u in np.linspace(a+.02,b-.02,max(2,int((b-a)*13))):
        q=sample(d,u);t=tangent(d,u);n=np.array([-t[1],t[0]])
        ps=[q-n*width*.50-t*15,q-n*20+t*14,q+n*20+t*14,q+n*width*.50-t*12]
        path(ctx,[('M',tuple(ps[0])),('C',tuple(np.r_[ps[1],ps[2],ps[3]]))]);source(ctx,'#171212');ctx.set_line_width(1.05);ctx.stroke()

def clip_band(ctx,d,a,b,width=94):
    # Make a filled polygon offset from the centerline to clip warped glyphs.
    p=segment(d,a,b)
    if len(p)<2:return
    t=np.gradient(p,axis=0);t=t/np.maximum(np.linalg.norm(t,axis=1)[:,None],1e-6);n=np.c_[-t[:,1],t[:,0]]
    poly(ctx,np.vstack([p+n*width/2,(p-n*width/2)[::-1]]));ctx.clip()


def top_pattern(ctx):
    """Large orange cut-paper shapes on the upper arc; these are not lettering."""
    for i,(u0,u1) in enumerate([(0,.18),(.19,.43),(.45,.71),(.73,.95)]):
        q=sample(TOP_BAND,(u0+u1)/2);tt=tangent(TOP_BAND,(u0+u1)/2)
        ctx.save();ctx.translate(*q);ctx.rotate(math.atan2(tt[1],tt[0]));
        if i%2==0:
            draw(ctx,'M-59 -47 L53 -47 L36 48 L-10 15 L-42 45 Z','#ff9900',INK,1.2)
            draw(ctx,'M-28 -43 L0 -43 L-14 -12 Z','#f200d7',INK,1.1)
        else:
            draw(ctx,'M-50 -46 C20 -58 56 -9 20 31 L53 47 L-38 47 C-70 8 -71 -14 -50 -46 Z','#ff9900',INK,1.2)
        ctx.restore()

def render_art(ctx,f,text='TOGETHER'):
    if f<61:return
    a=ease(f,92,96)
    if a>0:
        rect(ctx,1085,132,380*a,133,linear(1085,130,1465,130,'#ffffff','#ff9200','#ff9900'))
        rect(ctx,1465,132,33*a,265,linear(1465,132,1500,132,'#c7b2ff','#a493ff'))
        rect(ctx,1465,265,63*a,132,linear(1465,265,1528,265,'#b091ff','#6f25ff'))
        rect(ctx,1416,397,112*a,135,linear(1416,397,1528,397,'#ffc717','#ff927d','#b9acff'))
        rect(ctx,1554,265,10*a,132,'#f7b0f4')
    # Back and inner elements appear through different attachment points.
    for o in sorted(OBJECTS,key=lambda o:o['layer']):
        if o['layer']<8:render_object(ctx,o,f)
    # Two independent logo paths grow over the original UI. Their black offset
    # outlines make the close overlaps at the inner diagonal unambiguous.
    lp=key(f,[(62,0),(63,.03),(65,.22),(66,.34),(67,.56),(68,.56),(69,.95),(70,.95),(71,1)])
    if lp>0:
        colored_band(ctx,LEFT_TEXT,1-lp,1)
        ctx.save();clip_band(ctx,LEFT_TEXT,1-lp,1)
        text_on_path(ctx,text,LEFT_TEXT,.015,.91,86)
        ctx.restore()
    rp=key(f,[(62,0),(63,.055),(65,.18),(66,.23),(67,.40),(68,.40),(70,.59),(72,.72),(74,.88),(75,1)])
    if rp>0:
        colored_band(ctx,RIGHT,0,rp)
        ctx.save();clip_band(ctx,RIGHT,0,rp)
        text_on_path(ctx,'DRAW',DIAGONAL,.035,.95,85)
        text_on_path(ctx,text,RIGHT_TEXT,.015,.98,86)
        # Oversized geometric drawing on the upper ribbon remains unchanged.
        top_pattern(ctx)
        ctx.restore()
    tail=ease(f,72,76)
    if tail>0:
        ctx.save();poly(ctx,[(400,480),(720,480),(720,654),(917,852),(400,930)]);ctx.clip()
        ctx.save();ctx.translate(6,8);stroke(ctx,LEFT_TAIL,'#000',97,0,tail);ctx.restore()
        stroke(ctx,LEFT_TAIL,INK,92,0,tail);stroke(ctx,LEFT_TAIL,PINK,89,0,tail)
        ctx.save();clip_band(ctx,LEFT_TAIL,0,tail);text_on_path(ctx,'IMAGINE',LEFT_TAIL,0,1,84);ctx.restore()
        if tail>.85:
            draw(ctx,'M832 770 L915 847 L800 844',None,INK,5)
        ctx.restore()
    # Paper curls at the unfolding edges, shaded as independent swept surfaces.
    for start,end,cx,cy,ang,size in [(60,63,732,548,1.05,205),(66,69,671,563,.36,284),(70,75,1094,302,1.22,325)]:
        p=ramp(f,start,end)
        if 0<p<1:
            ctx.save();ctx.translate(cx+(p-.5)*65,cy);ctx.rotate(ang*(1-.2*p));ctx.scale(max(.02,math.sin(math.pi*p)),1)
            d=f'M0 {-size/2} C-58 {-size*.23} -65 {size*.28} 0 {size/2} C21 {size*.32} 22 {-size*.30} 0 {-size/2} Z'
            if start==60:
                d='M0 -102 C-20 -110 -30 -97 -25 -82 C-54 -81 -50 -56 -34 -49 C-64 -39 -55 -14 -34 -11 C-64 8 -54 31 -32 32 C-54 59 -39 80 0 102 C20 75 22 -70 0 -102 Z'
            draw(ctx,d,linear(-65,0,25,0,'#5c6081','#cae5e5','#b6d6dd','#646888'),None)
            ctx.restore()
    # The principal right paper fold translates and turns continuously while
    # the lettered band is revealed behind it. It is an independent occluder.
    if 64<f<73:
        cx=key(f,[(64,1028),(65,1070),(67,1165),(69,1300),(71,1390),(73,1440)])
        cy=key(f,[(64,662),(65,625),(67,690),(69,680),(71,680),(73,660)])
        ang=key(f,[(64,.7),(65,.35),(67,-.15),(69,-.65),(71,-.65)])
        sz=key(f,[(64,230),(65,380),(67,410),(69,330),(71,160),(73,0)])
        amp=ease(f,64,65)*(1-smooth(f,71,73))
        ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.scale(max(.001,amp),1)
        d=f'M0 {-sz/2} C-64 {-sz*.28} -67 {sz*.30} 0 {sz/2} C27 {sz*.31} 25 {-sz*.27} 0 {-sz/2} Z'
        draw(ctx,d,linear(-69,0,28,0,'#5f6689','#c5e0e4','#c6e9eb','#626a89'),None)
        ctx.restore()
    for o in sorted(OBJECTS,key=lambda o:o['layer']):
        if o['layer']>=8:render_object(ctx,o,f)
    if f>90:
        pp=smooth(f,90,96)
        def orb_fold():
            draw(ctx,'M1083 526 C1160 511 1243 583 1313 618 L1312 608 C1235 579 1162 498 1083 526 Z',linear(1160,512,1160,555,'#7c84aa','#c7e5e8','#ecf6f2'),None)
        group_alpha(ctx,pp,orb_fold)
    # First four seconds end in the beginning of another graphic handoff.
    exitp=smooth(f,89,96)
    if exitp>0:
        pp=max(.0001,smooth(f,90,96))
        # A new monochrome upper arc is uncovered behind the retreating ribbon.
        ctx.save();ctx.rectangle(1005,185,410,260*exitp);ctx.clip()
        stroke(ctx,TOP_BAND,'#000',92)
        text_on_path(ctx,text,TOP_BAND,0,1,78,'#fff','#000',1.4)
        ctx.restore()
        def tip():
            draw(ctx,'M829 165 L955 234 L951 211 L1022 260 L1076 293 L1070 326 L1107 299 L1217 419 L1145 382 L1076 401 L974 319 L897 288 Z',linear(880,340,1040,220,'#6aac82','#8bd600'),INK,1.1)
        ctx.save();ctx.translate(1070,326);ctx.scale(pp,pp);ctx.translate(-1070,-326);tip();ctx.restore()
        # Remaining upper ornaments fold away individually.
        for cx,cy,sz in [(1228,148,135),(1402,153,120),(1002,80,90)]:
            pp=ramp(f,91+(cx%3),98)
            if pp>0:
                ctx.save();ctx.translate(cx,cy);ctx.rotate(.2+pp*.4)
                draw(ctx,f'M{-sz/2} 0 C{-sz/4} -22 {sz/4} -32 {sz/2} 0 C{sz/4} 16 {-sz/4} 15 {-sz/2} 0 Z',linear(0,-28,0,16,'#777a99','#d9ebeb','#fafafa'),None);ctx.restore()
