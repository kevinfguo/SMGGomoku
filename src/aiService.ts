// 'use strict';
// angular.module('myApp').service('aiService', function() {

module aiService{

  'use strict';

  class mapPoint{
    r : any;
    c : any;
    set : any;
    score : any;
    valid : any;
    info : any;
    constructor(r : any, c : any){
      this.r=r;
      this.c=c;
      this.set=false;
      this.score=0;
      this.valid=false;
      this.info=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    }
  }
  // var ai={};

  var sum : any = 0;
  var setNum : any = 0;
  var scopeMap : any = [];
  var scorequeue : any = [];
  var map : any = [];
  var moves=[
          [-1,-1],
          [-1,0],
          [0,-1],
          [-1,1]
      ];
  var coe=[-2,1];
  var scores=[0,1,10,2000,4000,100000000000];
  var cache : any;
  var otc : any;
  var depth : any;
  var totry : any;
  var myColor : any;

  for (var i=0;i<15;i++){
      var tmp : any=[];
      for(var j=0;j<15;j++){
          var a= new mapPoint(i,j);
          tmp.push(a);
          scorequeue.push(a);
      }
      map.push(tmp);
  }

  var boardBuf = new ArrayBuffer(255);
  var boardBufArr = new Uint8Array(boardBuf);

  export function bufToString(){
      return String.fromCharCode.apply(null, boardBufArr);
  }

  export function ini(mode : any,color : any){
      myColor = color;
      if(color=='black'){
          otc='white';
      }else{
          otc='black';
      }
      switch(mode){
          case 'easy':
          depth=4;
          totry=[12,8];
          break;
          case 'hard':
          depth=7;
          totry=[10,10];
          break;
          default:
          console.log('ini erro');
      }
      console.log('ini complete');
  };
  export function watch(r : any,c : any,color : any){
    updateMap(r,c,color);
    if(color=='remove'){
      setNum--;
    }
    else setNum++;
    scorequeue.sort(sortMove);

  }

  export function updateMap(r : any,c : any,color : any){
      var remove=false,num : any;
      if(color==myColor){
          num=1;
      }else if(color==otc){
          num=0;
      }else{
          remove=true;
          num=map[r][c].set-1;
      }
      return _updateMap(r,c,num,remove);
  };

  export function _updateMap(r : any,c : any,num : any,remove : any){
      var i=4,x : any,y : any,step : any,tmp : any,xx : any,yy : any,cur : any,changes=0,s : any,e : any;
      if (!remove){
          boardBufArr[r * 15 + c] = num + 2;
          map[r][c].set=num+1;
          while (i--){
              x=r;
              y=c;
              step=5;
              while( step-- && x>=0 && y>=0 && y<15 ){
                  xx=x-moves[i][0]*4;
                  yy=y-moves[i][1]*4;
                  if(xx>=15 || yy<0 || yy>=15){
                      x+=moves[i][0];
                      y+=moves[i][1];
                      continue;
                  }
                  cur=map[x][y].info[i];
                  if(cur[2]>0){
                      tmp=5;
                      xx=x;
                      yy=y;
                      s=scores[cur[2]];
                      changes-=s*cur[3];
                      while( tmp-- ){
                          map[xx][yy].score-=s;
                          xx-=moves[i][0];
                          yy-=moves[i][1];
                      }
                  }
                  cur[num]++;
                  if(cur[1-num]>0){
                      cur[2]=0;
                  }else{
                      cur[2]=cur[num];
                      e=coe[num];
                      cur[3]=e;
                      s=scores[cur[2]];
                      tmp=5;
                      xx=x;
                      yy=y;
                      changes+=s*cur[3];
                      while( tmp-- ){
                          map[xx][yy].score+=s;
                          xx-=moves[i][0];
                          yy-=moves[i][1];
                      }
                  }
                  x+=moves[i][0];
                  y+=moves[i][1];
              }
          }
      }else{
          boardBufArr[r * 15 + c] = 0;
          map[r][c].set=false;
          while(i--){
              x=r;
              y=c;
              step=5;
              //others 0 i am 1-> sc=0
              //others 0 i am more than 1-> sc=1
              //i am >0 others >0 -> sc=-1
              while( step-- && x>=0 && y>=0 && y<15 ){
                  xx=x-moves[i][0]*4;
                  yy=y-moves[i][1]*4;
                  if(xx>=15 || yy<0 || yy>=15){
                      x+=moves[i][0];
                      y+=moves[i][1];
                      continue;
                  }
                  cur=map[x][y].info[i];
                  var sc=0;
                  cur[num]--;
                  if(cur[2]>0){
                      tmp=5;
                      xx=x;
                      yy=y;
                      s=scores[cur[2]];
                      changes-=s*cur[3];
                      while( tmp-- ){
                          map[xx][yy].score-=s;
                          xx-=moves[i][0];
                          yy-=moves[i][1];
                      }
                      cur[2]--;
                      if(cur[num]>0)sc=1;
                  }else if(cur[1-num]>0 && !cur[num]){
                      sc=-1;
                  }
                  if(sc===1){
                      tmp=5;
                      s=scores[cur[2]];
                      xx=x;
                      yy=y;
                      changes+=s*cur[3];
                      while( tmp-- ){
                          map[xx][yy].score+=s;
                          //if(!map[xx][yy].set)changes+=s*cur[3];
                          xx-=moves[i][0];
                          yy-=moves[i][1];
                      }
                  }else if(sc===-1){
                      cur[2]=cur[1-num];
                      tmp=5;
                      s=scores[cur[2]];
                      cur[3]=coe[1-num];
                      xx=x;
                      yy=y;
                      changes+=s*cur[3];
                      while( tmp-- ){
                          map[xx][yy].score+=s;
                          //if(!map[xx][yy].set)changes+=s*cur[3];
                          xx-=moves[i][0];
                          yy-=moves[i][1];
                      }
                  }
                  x+=moves[i][0];
                  y+=moves[i][1];
              }
          }
      }
      sum+=changes;
  };

  export function simulate(x : any,y : any,num : any){
      setNum++;
      _updateMap(x,y,num,false);
  };

  export function desimulate(x : any,y : any,num : any){
      _updateMap(x,y,num,true);
      setNum--;
  };

  export function sortMove(a : any,b : any){
      if(a.set)return 1;
      if(b.set)return -1;
      if(a.score<b.score){
          return 1;
      }
      else return -1;
  };

  cache={};

  export function nega(x : any,y : any,this_depth : any,alpha : any,beta : any){
      var pt=map[x][y].info, i=4, num=this_depth%2;
      simulate(x,y,num);
      var bufstr = bufToString();
      if(cache[bufstr]){
          return cache[bufstr];
      }
      if(Math.abs(sum)>=10000000)return -1/0;
      if(setNum===225){
          return 0;
      }else if(this_depth===0){
          return sum;
      }
      scorequeue.sort(sortMove);
      var i : number =totry[num], tmp : any, tmpqueue : any=[], b=beta;
      while(i--){
          tmp=scorequeue[i];
          if(tmp.set) continue;
          tmpqueue.push(tmp.c);
          tmpqueue.push(tmp.r);
      }
      this_depth-=1;
      i=tmpqueue.length-1;
      x=tmpqueue[i];
      y=tmpqueue[--i];
      var score=-nega(x,y,this_depth,-b,-alpha);
      desimulate(x,y,this_depth%2);
      if(score>alpha){
          bufstr = bufToString();
          cache[bufstr] = score;
          alpha=score;
      }
      if(alpha>=beta){
          bufstr = bufToString();
          cache[bufstr] = beta;
          return alpha;
      }
      b=alpha+1;
      while(i--){
          x=tmpqueue[i];
          y=tmpqueue[--i];
          score=-nega(x,y,this_depth,-b,-alpha);
          desimulate(x,y,this_depth%2);
          if(alpha<score && score<beta){
              score=-nega(x,y,this_depth,-beta,-alpha);
              desimulate(x,y,this_depth%2);
          }
          if(score>alpha){
              alpha=score;
          }
          if(alpha>=beta){
              return alpha;
          }
          b=alpha+1;
      }
      return alpha;
  };

  export function move(){
      cache={};
      var alpha=-1/0, beta=1/0,bestmove=[scorequeue[0].r, scorequeue[0].c];
      var i=20, tmp : any, tmpqueue : any=[], this_depth : any=depth;
      while(i--){
          tmp=scorequeue[i];
          if(tmp.score.set)continue;
          tmpqueue.push(tmp.c);
          tmpqueue.push(tmp.r);
      }
      i=tmpqueue.length-1;
      var x : any,y : any,b=beta;
      x=tmpqueue[i];
      y=tmpqueue[--i];
      var score=-nega(x,y,this_depth,-b,-alpha);
      desimulate(x,y,this_depth%2);
      if(score>alpha){
          alpha=score;
          bestmove=[x,y];
      }
      b=alpha+1;
      while(i--){
          x=tmpqueue[i];
          y=tmpqueue[--i];
          score=-nega(x,y,this_depth,-b,-alpha);
          desimulate(x,y,this_depth%2);
          if(alpha<score && score<beta){
              score=-nega(x,y,this_depth,-beta,-alpha);
              desimulate(x,y,this_depth%2);
          }
          if(score>alpha){
              alpha=score;
              bestmove=[x,y];
          }
          b=alpha+1;
      }
      return bestmove;
  };
  export function iniComputer(d : any){
    if(d === undefined){
      ini('hard', 'white');
      }
      else{
      ini(d,'white');
    }
  }

  export function informingComputer(r : any, c : any, color : any){
    watch(r, c, color);
  }

  export function getMove(){
    var bestmove = move();
    return bestmove;
  }
}
