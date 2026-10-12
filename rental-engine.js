(() => {
 const examples=[
  {id:'A',name:'示例 A · 通勤型单人公寓',rent:220,commute:20,type:'single',pets:false,quiet:2},
  {id:'B',name:'示例 B · 安静合住房间',rent:150,commute:35,type:'shared',pets:true,quiet:4},
  {id:'C',name:'示例 C · 家庭联排住宅',rent:380,commute:45,type:'family',pets:true,quiet:5},
  {id:'D',name:'示例 D · 可养宠单人公寓',rent:190,commute:40,type:'single',pets:true,quiet:3},
  {id:'E',name:'示例 E · 通勤便利合住房间',rent:180,commute:25,type:'shared',pets:false,quiet:3}
 ];
 const weights={quiet:{quiet:.6,commute:.25,budget:.15},commute:{quiet:.25,commute:.6,budget:.15},budget:{quiet:.15,commute:.25,budget:.6}};
 const typeLabels={any:'不限定',single:'独居',shared:'合住',family:'家庭'},priorityLabels={quiet:'安静',commute:'通勤',budget:'预算余量'};
 function compare(input){
  const q={budget:Number(input.budget),commute:Number(input.commute),type:input.type,priority:input.priority,pets:!!input.pets};
  if(!Number.isFinite(q.budget)||q.budget<50||q.budget>2000||!Number.isFinite(q.commute)||q.commute<5||q.commute>90||!Object.hasOwn(typeLabels,q.type)||!Object.hasOwn(weights,q.priority))throw new Error('请填写有效预算、通勤时间和偏好。');
  const w=weights[q.priority];const all=examples.map(item=>{const rejected=[];if(item.rent>q.budget)rejected.push('超过预算');if(item.commute>q.commute)rejected.push('超过通勤上限');if(q.type!=='any'&&item.type!==q.type)rejected.push('居住方式不符');if(q.pets&&!item.pets)rejected.push('不符合养宠需求');return {...item,rejected}});
  const matches=all.filter(item=>!item.rejected.length).map(item=>{const components={quiet:item.quiet/5*100,commute:(q.commute-item.commute)/q.commute*100,budget:(q.budget-item.rent)/q.budget*100};const score=components.quiet*w.quiet+components.commute*w.commute+components.budget*w.budget;return {...item,components,score:Number(score.toFixed(1)),displayScore:Math.round(score)}}).sort((a,b)=>b.score-a.score||a.rent-b.rent||a.id.localeCompare(b.id));
  return {query:q,matches,excluded:all.filter(item=>item.rejected.length),weights:w,city:'Manchester',currency:'GBP',rentPeriod:'week',summary:'曼城 · 周租预算≤£'+q.budget.toLocaleString('en-GB')+'/week，通勤≤'+q.commute+'分钟，'+typeLabels[q.type]+(q.pets?'，需可养宠':'')+'；优先'+priorityLabels[q.priority]+'。'};
 }
 globalThis.RentalDemo={examples,weights,typeLabels,priorityLabels,compare};
})();
