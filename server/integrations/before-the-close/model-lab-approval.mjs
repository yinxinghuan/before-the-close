// Only already-approved, already-created local acceptance ledgers. This module
// never grants a budget, creates a DB, or sends a model/network request.
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
export async function financeModelLabApproval(root,round,sourceHash){
  if(!['2','3'].includes(round))throw Error('UNKNOWN_MODEL_APPROVAL');
  const directory=join(root,'.local-tests/model-acceptance-20260929-round'+round);
  const origin=JSON.parse(await readFile(join(directory,'origin.json'),'utf8'));
  if(origin.sourceHash!==sourceHash)throw Error('MODEL_APPROVAL_SOURCE_CHANGED');
  const config={path:join(directory,'ledger.sqlite'),worldId:'finance-live-acceptance-20260929-round'+round,budgetId:'user-approved-six-20260929-round'+round,maximum:6,owner:'isolated-model-reviewer'};
  const db=new DatabaseSync(config.path,{readOnly:true});
  try{
    const binding=db.prepare('SELECT game FROM async_world_binding WHERE world=?').get(config.worldId);
    const budget=db.prepare('SELECT maximum,used FROM async_model_budgets WHERE world=? AND id=?').get(config.worldId,config.budgetId);
    if(binding?.game!=='before-the-close'||budget?.maximum!==6||!Number.isSafeInteger(budget.used)||budget.used<0||budget.used>6)throw Error('MODEL_APPROVAL_LEDGER_INVALID');
    return {...config,usage:{maximum:budget.maximum,used:budget.used}};
  }finally{db.close();}
}
