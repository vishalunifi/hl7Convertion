# HL7 Conversion

This project is designed to parse HL7 messages and convert them into a custom JSON format. It includes sample HL7 messages and a parser to process these messages.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vishalunifi/hl7Convertion.git
   cd hl7Convertion
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To run the HL7 message parser, you can use the `hl7` script defined in the `package.json`.

1. Start the server:
   ```bash
   npm run hl7
   ```

This script will run `hl7Server9.js` using `nodemon`, which will monitor for any changes in the file and restart the server automatically.

## HL7 Messages

The following sample HL7 messages are parsed by the script:

1. `ADT^A01` (Patient Admit):

   ```javascript
   const hl7Message2 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249||ADT^A01|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|`;
   ```

2. `ADT^A02` (Patient Transfer):

   ```javascript
   const hl7Message3 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249||ADT^A02|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|PV2|||MainWard^123^Bed1^|ER^456^Bed2^|`;
   ```

3. `ADT^A03` (Patient Discharge):
   ```javascript
   const hl7Message4 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249||ADT^A03|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|1|D|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|`;
   ```

## Code Overview

### `hl7Server9.js`

The main script for parsing and converting HL7 messages.
