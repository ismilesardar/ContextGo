import { v4 as uuidv4 } from 'uuid';

const prefixes = [
  'ws_', // workspace
  'user_', // user
  'link_', // link
  'tag_', // tag
  'fold_', // folder
  'dom_', // domain
  'po_', // payout
  'dash_', // dashboard
  'int_', // integration
  'app_', // oauth app
  'cus_', // customer
  'utm_', // utm template
  'wh_', // webhook
  'pn_', // partner
  'dpn_', // discovered partner
  'prog_', // program
  'pga_', // program application
  'pgi_', // program invitation
  'pge_', // program enrollment
  'pgr_', // program resources
  'pgdl_', // program group default link
  'inv_', // invoice
  'cm_', // commission
  'rw_', // reward
  'disc_', // discount
  'dcode_', // discount code
  'dub_embed_', // dub embed
  'audit_', // audit log
  'import_', // import log
  'grp_', // group
  'bnty_', // bounty
  'bnty_sub_', // bounty submission
  'wf_', // workflow
  'msg_', // message
  'em_', // notification email,
  'cmp_', // campaign
  'fr_', // fraud rule
  'fre_', // fraud event
  'frg_', // fraud event group
  'ref_', // referral
  'pb_' // partner postback
] as const;

// Creates a unique ID using `uuid` v4 with an optional prefix
export const createId = ({ prefix }: { prefix: (typeof prefixes)[number] }) => {
  // Remove hyphens for a compact identifier
  const id = uuidv4().replace(/-/g, '');
  return `${prefix}${id}`;
};
