# HL11 Server

## Overview

This server parses HL7 messages and converts them into a custom JSON format.

## Files

### `hl7Server11.js`

This file contains the HL7 messages and functions to parse and convert them.

## HL7 Messages

```javascript
const hl7Message2 = `MSH|^~\&|Sender|Receiver|App|Facility|202407191249||ADT^A01|MsgID|P|2.5|\r
PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|\r
PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|\r`;

const hl7Message3 = `MSH|^~\&|Sender|Receiver|App|Facility|202407191249||ADT^A02|MsgID|P|2.5|\r
PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|\r
PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|PV2|||MainWard^123^Bed1^|ER^456^Bed2^|\r`;

const hl7Message4 = `MSH|^~\&|Sender|Receiver|App|Facility|202407191249||ADT^A03|MsgID|P|2.5|\r
PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|\r
PV1|1|D|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|\r`;
```

## Functions

### parseHL7Message(hl7Message)

- Parses the HL7 message into segments and fields.

- convertToCustomJSON(parsedMessage)
- Converts the parsed HL7 message into a custom JSON format.

- processHL7Messages()

- Processes and prints the parsed and converted HL7 messages.

### Thank you
