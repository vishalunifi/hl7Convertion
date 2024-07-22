const hl7Message = `MSH|^~\\&|Particle Health_ADT|1122^St. Mary Hospital^HOS|RECEIVING_APP|
1234^Sample Health|20190306081949||ADT^A08|752f3eab-2d11-411a-b597-2b08325d1f20|
P|2.5\rEVN|A08|20190305214300||EDIT_ENCOUNTER\rPID|1|35774410^^^PP^PP|
a5782a06-95b5-47b3-be19-10ea60693f3c^^^sam^sam||Weasley^Fred^||
19780401|M|||11400 Lansdowne St^^Boston^MA^02215|||||||
439682389064|\rPD1||||1063484053^Haque^Mohammed^^^^\rPV1|1|E|||||
1601234567^Rubeus^Hagrid^^^^|||||||Home|||||454123456789|||||||||||||||||||||||||
20190305214300||||||31377573\rIN1|1|||Self Pay  J|||||||||||Self Pay|||||||||||||||||||||
UNKNOWN\rZMD|51603c65-839b-48a0-9e9f-b3b7fa0c13d0\rZPP|PROGRAMS\rZPP|--------\rZPP
|1. Sample Health\rZPP|2. ACME Health\rZPP|\rZPP|\rZPP|PRACTICES\rZPP|--------\rZPP|
1. Practice Unknown\rZPP|\rZPP|\rZPP|CARE COORDINATORS\rZPP|-----------------\rZPP|
Name.   : Transitions of Care Team\rZPP|Phone.  : 855-677-8787\rZPP|Email.  : \rZPP|
Fax.    : 866-567-1010\rZPP|-------------------------------------\rZPP|Name.   
: Utilization Management\rZPP|Phone.  : 877-333-6161\rZPP|Email.  : \rZPP|Fax.  
  : \rZPP|-------------------------------------\rZPP|\rZPP|\rZPP|ADMIT CARE INSTRUCTIONS\rZPP
  |-----------------------\rZPP|1. All other health plans call (212) 555-8697 and ask to speak
   with the Extensivist on call.\rZPP|2. Fidelis MMP call (877) 333-6161 for an authorization.
   \rZPP|\rZPP|\rZPP|DISCHARGE CARE INSTRUCTIONS\rZPP|---------------------------\rZPP|1. Call
    (855) 255-8282 to reach or get a message to a Transition Coordinator.\rZPP|\rZPP|\rZPP|
    OTHER CARE PROVIDERS\rZPP|--------------------\rZPP|Name.   : Luna Lovegood \rZPP|Phone. 
     : \rZPP|Email.  : \rZPP|Fax.    : \rZPP|Cohort Name    : Practice Unknown\rZPP|
     -------------------------------------\rZPP|\rZPP|\r`;
// 2. ADT^A02 (Patient Transfer):
const hl7Message2 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249|
|ADT^A01|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|
1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|`; // 2. ADT^A02 (Patient Transfer)
const hl7Message3 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249||ADT^A02|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|PV2|||MainWard^123^Bed1^|ER^456^Bed2^|`; // 3. ADT^A03 (Patient Discharge)
const hl7Message4 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249||ADT^A03|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|1|D|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|`;
