const hl7Message2 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249||ADT^A01|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|`; // 2. ADT^A02 (Patient Transfer)
const hl7Message3 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249||ADT^A02|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|PV2|||MainWard^123^Bed1^|ER^456^Bed2^|`; // 3. ADT^A03 (Patient Discharge)
const hl7Message4 = `MSH|^~\\&|Sender|Receiver|App|Facility|202407191249||ADT^A03|MsgID|P|2.5|PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|PV1|1|D|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|`;

function parseHL7Message(hl7Message) {
  const segments = hl7Message.split(/\r|\n/);
  // Filter out empty segments

  // Initialize an empty object to store parsed data
  const parsedMessage = {};

  segments.forEach((segment) => {
    const fields = segment.split("|"); // Filter out empty fields
    const segmentName = fields[0]; // First field is the segment name

    if (segmentName in parsedMessage) {
      parsedMessage[segmentName].push(fields); // Add to existing segment
    } else {
      parsedMessage[segmentName] = [fields]; // Initialize segment if it doesn't exist
    }
  });

  return parsedMessage;
}

function convertToCustomJSON(parsedMessage) {
  const result = {};

  if (parsedMessage.MSH) {
    const msh = parsedMessage.MSH[0];
    result.MSH = {
      FieldSeparator: "|",
      EncodingCharacters: msh[1],
      SendingApplication: msh[2],
      ReceivingApplication: msh[3],
      SendingFacility: msh[4],
      ReceivingFacility: msh[5],
      DateTimeOfMessage: msh[6],
      Security: msh[7],
      MessageType: {
        MessageCode: msh[8]?.split("^")[0] || "",
        TriggerEvent: msh[8]?.split("^")[1] || "",
      },
      MessageControlID: msh[9],
      ProcessingID: msh[10],
      VersionID: msh[11],
      PID: msh[12],
      SetID: msh[13],
      PatientID: {
        ID: msh[14]?.split("^")[0] || "",
        CheckDigit: msh[14]?.split("^")[1] || "",
        CheckDigitScheme: msh[14]?.split("^")[2] || "",
      },
      PatientName: {
        FamilyName: msh[16]?.split("^")[0] || "",
        GivenName: msh[16]?.split("^")[1] || "",
        MiddleInitialOrName: msh[16]?.split("^")[2] || "",
      },
      DateTimeOfBirth: msh[18],
      Sex: msh[19],
      PV1: msh[20],
      SetID: msh[21],
      PatientClass: msh[22],
      AssignedPatientLocation: {
        PointOfCare: msh[23]?.split("^")[0] || "",
        Room: msh[23]?.split("^")[1] || "",
        Bed: msh[23]?.split("^")[2] || "",
      },
      AttendingDoctor: {
        ID: msh[25]?.split("^")[0] || "",
        FamilyName: msh[25]?.split("^")[1] || "",
        GivenName: msh[25]?.split("^")[2] || "",
      },
      AdmitSource: msh[26],
      HospitalService: msh[27],
    };
  }

  return result;
}

// Test with hl7Message2
const parsedMessage2 = parseHL7Message(hl7Message2);
const customJSON2 = convertToCustomJSON(parsedMessage2);
console.log("Output for hl7Message2:", JSON.stringify(customJSON2, null, 2));

// Test with hl7Message3
const parsedMessage3 = parseHL7Message(hl7Message3);
const customJSON3 = convertToCustomJSON(parsedMessage3);
console.log("Output for hl7Message3:", JSON.stringify(customJSON3, null, 2));

// Test with hl7Message4
const parsedMessage4 = parseHL7Message(hl7Message4);
const customJSON4 = convertToCustomJSON(parsedMessage4);
console.log("Output for hl7Message4:", JSON.stringify(customJSON4, null, 2));
// Expected output
// {
//   "MSH": {
//     "FieldSeparator": "|",
//     "EncodingCharacters": "^~\\&",
//     "SendingApplication": "Sender",
//     "ReceivingApplication": "Receiver",
//     "SendingFacility": "App",
//     "ReceivingFacility": "Facility",
//     "DateTimeOfMessage": "202407191249",
//     "Security": "",
//     "MessageType": {
//       "MessageCode": "ADT",
//       "TriggerEvent": "A01"
//     },
//     "MessageControlID": "MsgID",
//     "ProcessingID": "P",
//     "VersionID": "2.5"
//   },
//   "PID": {
//     "SetID": "1",
//     "PatientID": {
//       "ID": "PtID12345",
//       "CheckDigit": "5",
//       "CheckDigitScheme": "M11"
//     },
//     "PatientName": {
//       "FamilyName": "DOE",
//       "GivenName": "JOHN",
//       "MiddleInitialOrName": "A"
//     },
//     "DateTimeOfBirth": "19800101",
//     "Sex": "M"
//   },
//   "PV1": {
//     "SetID": "1",
//     "PatientClass": "I",
//     "AssignedPatientLocation": {
//       "PointOfCare": "MainWard",
//       "Room": "123",
//       "Bed": "Bed1"
//     },
//     "AttendingDoctor": {
//       "ID": "ATTND123",
//       "FamilyName": "DOE",
//       "GivenName": "JANE"
//     },
//     "AdmitSource": "ADM",
//     "HospitalService": "MED"
//   }
// }
