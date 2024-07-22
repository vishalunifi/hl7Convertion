const hl7Message = `MSH|^~\\&|Particle Health_ADT|1122^St. Mary Hospital^HOS|RECEIVING_APP|1234^Sample Health|20190306081949||ADT^A08|752f3eab-2d11-411a-b597-2b08325d1f20|P|2.5\r
EVN|A08|20190305214300||EDIT_ENCOUNTER\r
PID|1|35774410^^^PP^PP|a5782a06-95b5-47b3-be19-10ea60693f3c^^^sam^sam||Weasley^Fred^||19780401|M|||11400 Lansdowne St^^Boston^MA^02215|||||||439682389064|\r
PD1||||1063484053^Haque^Mohammed^^^^\r
PV1|1|E|||||1601234567^Rubeus^Hagrid^^^^|||||||Home|||||454123456789|||||||||||||||||||||||||20190305214300||||||31377573\r
IN1|1|||Self Pay  J|||||||||||Self Pay|||||||||||||||||||||UNKNOWN\r
ZMD|51603c65-839b-48a0-9e9f-b3b7fa0c13d0\r
ZPP|PROGRAMS\r
ZPP|--------\r
ZPP|1. Sample Health\r
ZPP|2. ACME Health\r
ZPP|\r
ZPP|\r
ZPP|PRACTICES\r
ZPP|--------\r
ZPP|1. Practice Unknown\r
ZPP|\r
ZPP|\r
ZPP|CARE COORDINATORS\r
ZPP|-----------------\r
ZPP|Name.   : Transitions of Care Team\r
ZPP|Phone.  : 855-677-8787\r
ZPP|Email.  : \r
ZPP|Fax.    : 866-567-1010\r
ZPP|-------------------------------------\r
ZPP|Name.   : Utilization Management\r
ZPP|Phone.  : 877-333-6161\r
ZPP|Email.  : \r
ZPP|Fax.    : \r
ZPP|-------------------------------------\r
ZPP|\r
ZPP|\r
ZPP|ADMIT CARE INSTRUCTIONS\r
ZPP|-----------------------\r
ZPP|1. All other health plans call (212) 555-8697 and ask to speak with the Extensivist on call.\r
ZPP|2. Fidelis MMP call (877) 333-6161 for an authorization.\r
ZPP|\r
ZPP|\r
ZPP|DISCHARGE CARE INSTRUCTIONS\r
ZPP|---------------------------\r
ZPP|1. Call (855) 255-8282 to reach or get a message to a Transition Coordinator.\r
ZPP|\r
ZPP|\r
ZPP|OTHER CARE PROVIDERS\r
ZPP|--------------------\r
ZPP|Name.   : Luna Lovegood \r
ZPP|Phone.  : \r
ZPP|Email.  : \r
ZPP|Fax.    : \r
ZPP|Cohort Name    : Practice Unknown\r
ZPP|-------------------------------------\r
ZPP|\r
ZPP|\r`;

const hl7Message2 = `MSH|^~\&|Sender|Receiver|App|Facility|202407191249||ADT^A01|MsgID|P|2.5|\r
PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|\r
PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|\r`;

const hl7Message3 = `MSH|^~\&|Sender|Receiver|App|Facility|202407191249||ADT^A02|MsgID|P|2.5|\r
PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|\r
PV1|1|I|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|PV2|||MainWard^123^Bed1^|ER^456^Bed2^|\r`;

const hl7Message4 = `MSH|^~\&|Sender|Receiver|App|Facility|202407191249||ADT^A03|MsgID|P|2.5|\r
PID|1|PtID12345^5^M11||DOE^JOHN^A||19800101|M|\r
PV1|1|D|MainWard^123^Bed1^||ATTND123^DOE^JANE|ADM|MED|\r`;

// Function to parse HL7 message
function parseHL7Message(hl7Message) {
  const segments = hl7Message
    .split(/\r|\n/)
    .filter((segment) => segment.trim() !== ""); // Filter out empty segments

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
      SendingFacility: {
        ID: msh[3]?.split("^")[0] || "",
        Name: msh[3]?.split("^")[1] || "",
        Type: msh[3]?.split("^")[2] || "",
      },
      ReceivingApplication: msh[4],
      ReceivingFacility: {
        ID: msh[5]?.split("^")[0] || "",
        Name: msh[5]?.split("^")[1] || "",
      },
      DateTimeOfMessage: msh[6],
      Security: msh[7],
      MessageType: {
        MessageCode: msh[8]?.split("^")[0] || "",
        TriggerEvent: msh[8]?.split("^")[1] || "",
      },
      MessageControlID: msh[9],
      ProcessingID: msh[10],
      VersionID: msh[11],
    };
  }

  if (parsedMessage.EVN) {
    const evn = parsedMessage.EVN[0];
    result.EVN = {
      EventTypeCode: evn[1],
      RecordedDateTime: evn[2],
      DateTimePlannedEvent: evn[3] || "",
      EventReasonCode: evn[4],
    };
  }

  if (parsedMessage.PID) {
    const pid = parsedMessage.PID[0];
    result.PID = {
      SetID: pid[1],
      PatientID: pid[2],
      PatientIdentifierList: {
        ID: pid[2]?.split("^")[0] || "",
        Type: pid[2]?.split("^")[1] || "",
        Authority: pid[2]?.split("^")[2] || "",
      },
      PatientName: {
        FamilyName: pid[5]?.split("^")[0] || "",
        GivenName: pid[5]?.split("^")[1] || "",
      },
      DateTimeOfBirth: pid[6],
      Sex: pid[7],
      PatientAddress: {
        Street: pid[11]?.split("^")[0] || "",
        City: pid[11]?.split("^")[2] || "",
        State: pid[11]?.split("^")[3] || "",
        Zip: pid[11]?.split("^")[4] || "",
      },
      PhoneNumberHome: pid[13],
      PhoneNumberBusiness: pid[14],
      PrimaryLanguage: pid[15],
      MaritalStatus: pid[16],
      Religion: pid[17],
      PatientAccountNumber: pid[18],
    };
  }

  if (parsedMessage.PD1) {
    const pd1 = parsedMessage.PD1[0];
    result.PD1 = {
      LivingDependency: pd1[1],
      PatientPrimaryCareProvider: {
        ID: pd1[3]?.split("^")[0] || "",
        FamilyName: pd1[3]?.split("^")[1] || "",
        GivenName: pd1[3]?.split("^")[2] || "",
      },
    };
  }

  if (parsedMessage.PV1) {
    const pv1 = parsedMessage.PV1[0];
    result.PV1 = {
      SetID: pv1[1],
      PatientClass: pv1[2],
      AssignedPatientLocation: pv1[3],
      AdmissionType: pv1[4],
      AttendingDoctor: {
        ID: pv1[5]?.split("^")[0] || "",
        FamilyName: pv1[5]?.split("^")[1] || "",
        GivenName: pv1[5]?.split("^")[2] || "",
      },
      ReferringDoctor: {
        ID: pv1[8]?.split("^")[0] || "",
        FamilyName: pv1[8]?.split("^")[1] || "",
        GivenName: pv1[8]?.split("^")[2] || "",
      },
      ConsultingDoctor: pv1[9],
      HospitalService: pv1[10],
      TemporaryLocation: pv1[11],
      PreadmitTestIndicator: pv1[12],
      ReadmissionIndicator: pv1[13],
      AdmitSource: pv1[14],
      AmbulatoryStatus: pv1[15],
      VIPIndicator: pv1[16],
      AdmittingDoctor: pv1[17],
      PatientType: pv1[18],
      VisitNumber: pv1[19],
      FinancialClass: pv1[20],
      ChargePriceIndicator: pv1[21],
      CourtesyCode: pv1[22],
      CreditRating: pv1[23],
      ContractCode: pv1[24],
      ContractEffectiveDate: pv1[25],
      ContractAmount: pv1[26],
      ContractPeriod: pv1[27],
      InterestCode: pv1[28],
      TransferToBadDebtCode: pv1[29],
      TransferToBadDebtDate: pv1[30],
      BadDebtAgencyCode: pv1[31],
      BadDebtTransferAmount: pv1[32],
      BadDebtRecoveryAmount: pv1[33],
      DeleteAccountIndicator: pv1[34],
      DeleteAccountDate: pv1[35],
      DischargeDisposition: pv1[36],
      DischargedToLocation: pv1[37],
      DietType: pv1[38],
      ServicingFacility: pv1[39],
      BedStatus: pv1[40],
      AccountStatus: pv1[41],
      PendingLocation: pv1[42],
      PriorTemporaryLocation: pv1[43],
      AdmitDateTime: pv1[44],
      DischargeDateTime: pv1[45],
      CurrentPatientBalance: pv1[46],
      TotalCharges: pv1[47],
      TotalAdjustments: pv1[48],
      TotalPayments: pv1[49],
    };
  }

  if (parsedMessage.PV2) {
    const pv2 = parsedMessage.PV2[0];
    result.PV2 = {
      PriorPendingLocation: pv2[3],
      AccommodationCode: pv2[4],
      AdmitReason: pv2[5],
      TransferReason: pv2[6],
      PatientValuables: pv2[7],
      PatientValuablesLocation: pv2[8],
      VisitUserCode: pv2[9],
      ExpectedAdmitDateTime: pv2[10],
      ExpectedDischargeDateTime: pv2[11],
      EstimatedLengthOfInpatientStay: pv2[12],
      ActualLengthOfInpatientStay: pv2[13],
      VisitDescription: pv2[14],
      ReferralSourceCode: pv2[15],
      PreviousServiceDate: pv2[16],
      EmploymentIllnessRelatedIndicator: pv2[17],
      PurgeStatusCode: pv2[18],
      PurgeStatusDate: pv2[19],
      SpecialProgramCode: pv2[20],
      RetentionIndicator: pv2[21],
      ExpectedNumberOfInsurancePlans: pv2[22],
      VisitPublicityCode: pv2[23],
      VisitProtectionIndicator: pv2[24],
      ClinicOrganizationName: pv2[25],
      PatientStatusCode: pv2[26],
      VisitPriorityCode: pv2[27],
      PreviousTreatmentDate: pv2[28],
      ExpectedDischargeDisposition: pv2[29],
      SignatureOnFileDate: pv2[30],
      FirstSimilarIllnessDate: pv2[31],
      PatientChargeAdjustmentCode: pv2[32],
      RecurringServiceCode: pv2[33],
      BillingMediaCode: pv2[34],
      ExpectedSurgeryDateTime: pv2[35],
      MilitaryPartnershipCode: pv2[36],
      MilitaryNonAvailabilityCode: pv2[37],
      NewbornBabyIndicator: pv2[38],
      BabyDetainedIndicator: pv2[39],
    };
  }

  if (parsedMessage.IN1) {
    const in1 = parsedMessage.IN1[0];
    result.IN1 = {
      SetID: in1[1],
      InsurancePlanID: in1[2],
      InsuranceCompanyName: in1[3],
      InsuranceCompanyAddress: {
        Street: in1[4]?.split("^")[0] || "",
        City: in1[4]?.split("^")[2] || "",
        State: in1[4]?.split("^")[3] || "",
        Zip: in1[4]?.split("^")[4] || "",
      },
      InsuranceCompanyContactPerson: in1[5],
      InsuranceCompanyPhoneNumber: in1[6],
      GroupNumber: in1[7],
      GroupName: in1[8],
      InsuredsGroupEmployerID: in1[9],
      InsuredsGroupEmployerName: in1[10],
      PlanEffectiveDate: in1[11],
      PlanExpirationDate: in1[12],
      AuthorizationInformation: in1[13],
      PlanType: in1[14],
      NameOfInsured: in1[15],
      InsuredRelationshipToPatient: in1[16],
      InsuredDateOfBirth: in1[17],
      InsuredAddress: {
        Street: in1[18]?.split("^")[0] || "",
        City: in1[18]?.split("^")[2] || "",
        State: in1[18]?.split("^")[3] || "",
        Zip: in1[18]?.split("^")[4] || "",
      },
      AssignmentOfBenefits: in1[19],
      CoordinationOfBenefits: in1[20],
      CoordOfBenPriority: in1[21],
      NoticeOfAdmissionFlag: in1[22],
      NoticeOfAdmissionDate: in1[23],
      ReportOfEligibilityFlag: in1[24],
      ReportOfEligibilityDate: in1[25],
      ReleaseInformationCode: in1[26],
      PreAdmitCert: in1[27],
      VerificationDateTime: in1[28],
      VerificationBy: in1[29],
      TypeOfAgreementCode: in1[30],
      BillingStatus: in1[31],
      LifetimeReserveDays: in1[32],
      DelayBeforeLRDay: in1[33],
      CompanyPlanCode: in1[34],
      PolicyNumber: in1[35],
      PolicyDeductible: in1[36],
      PolicyLimitAmount: in1[37],
      PolicyLimitDays: in1[38],
      RoomRateSemiPrivate: in1[39],
      RoomRatePrivate: in1[40],
      InsuredEmploymentStatus: in1[41],
      InsuredSex: in1[42],
      InsuredEmployerAddress: {
        Street: in1[43]?.split("^")[0] || "",
        City: in1[43]?.split("^")[2] || "",
        State: in1[43]?.split("^")[3] || "",
        Zip: in1[43]?.split("^")[4] || "",
      },
      VerificationByPhone: in1[44],
      PlanType2: in1[45],
      ReasonOfNoReleaseInfo: in1[46],
      InformationReceiver: in1[47],
      PolicyOriginationDate: in1[48],
      COBPriority: in1[49],
      InfoConditionDate: in1[50],
      InfoConditionType: in1[51],
      InsuranceCoContactReason: in1[52],
      InsuranceCoContactPersonName: in1[53],
      PersonAddress: {
        Street: in1[54]?.split("^")[0] || "",
        City: in1[54]?.split("^")[2] || "",
        State: in1[54]?.split("^")[3] || "",
        Zip: in1[54]?.split("^")[4] || "",
      },
    };
  }

  if (parsedMessage.ZMD) {
    const zmd = parsedMessage.ZMD[0];
    result.ZMD = {
      ProgramID: zmd[1],
    };
  }

  if (parsedMessage.ZPP) {
    const zpp = parsedMessage.ZPP;
    result.ZPP = zpp.map((zppField) => ({
      FieldContent: zppField[1],
    }));
  }

  return result;
}

// Function to process and print the parsed HL7 message
function processHL7Messages() {
  const parsedMessage1 = parseHL7Message(hl7Message);
  const parsedMessage2 = parseHL7Message(hl7Message2);
  const parsedMessage3 = parseHL7Message(hl7Message3);
  const parsedMessage4 = parseHL7Message(hl7Message4);

  //   console.log(JSON.stringify(parsedMessage1, null, 2));
  console.log(JSON.stringify(convertToCustomJSON(parsedMessage1), null, 2));

  //   console.log(JSON.stringify(parsedMessage2, null, 2));
  console.log(JSON.stringify(convertToCustomJSON(parsedMessage2), null, 2));

  //   console.log(JSON.stringify(parsedMessage3, null, 2));
  console.log(JSON.stringify(convertToCustomJSON(parsedMessage3), null, 2));

  //   console.log(JSON.stringify(parsedMessage4, null, 2));
  console.log(JSON.stringify(convertToCustomJSON(parsedMessage4), null, 2));
}

// Sample HL7 messages
const hl7Message5 = `MSH|^~\\&|ADT1|GOOD HEALTH HOSPITAL|GHH LAB|GHH|20230718130428||ADT^A01|HL7MSG00001|P|2.5\r
EVN|A01|20230718130421|||12345^DOE^JOHN|56789^DOE^JANE\r
PID|1||123456^^^GOOD HEALTH HOSPITAL^MR||DOE^JOHN^A^III||19750101|M||2106-3|123 MAIN ST^^CLEVELAND^OH^44130^USA||(216)123-4567|(216)123-4567||S||123456789|987-65-4321\r
NK1|1|DOE^JANE^A^III|SPOUSE||(216)123-4567\r
PV1|1|I|2000^2012^01||||12345^DOE^JOHN^A^III||56789^DOE^JANE^A^III||||||||||PAT|||||||||||||||||||20230718130421\r
AL1|1||^Penicillin||Produce Hives\r
DG1|1||786.50^Chest Pain^I9|||||A\r
PR1|1||P1234^Angioplasty^P\r
GT1|1|123456|DOE^JOHN^A^III|123 MAIN ST^^CLEVELAND^OH^44130^USA||(216)123-4567|19750101|M|S|123456789|987-65-4321\r
IN1|1|12345|AETNA|AETNA|PO BOX 123^CLEVELAND^OH^44130||(800)555-5555|999999|DOE^JOHN^A^III|123456789|JOHN DOE|19750101|M|123 MAIN ST^^CLEVELAND^OH^44130^USA|S|123456789|NONE|20230718130421|1|SELF|20230718130421|20230718130421\r`;

const hl7Message6 = `MSH|^~\\&|ADT1|GOOD HEALTH HOSPITAL|GHH LAB|GHH|20230718130428||ADT^A01|HL7MSG00002|P|2.5\r
EVN|A01|20230718130421|||12345^DOE^JOHN|56789^DOE^JANE\r
PID|1||789012^^^GOOD HEALTH HOSPITAL^MR||SMITH^JANE^B||19801111|F||2106-3|456 OAK ST^^CLEVELAND^OH^44130^USA||(216)456-7890|(216)456-7890||M||987654321|876-54-3210\r
NK1|1|SMITH^JOHN^B|HUSBAND||(216)456-7890\r
PV1|1|O|3000^3032^02||||12345^DOE^JOHN^B||56789^DOE^JANE^B||||||||||PAT|||||||||||||||||||20230718130421\r
AL1|1||^Aspirin||Nausea\r
DG1|1||R51^Headache^I9|||||A\r
PR1|1||P5678^MRI^P\r
GT1|1|789012|SMITH^JANE^B|456 OAK ST^^CLEVELAND^OH^44130^USA||(216)456-7890|19801111|F|M|987654321|876-54-3210\r
IN1|1|67890|BLUE CROSS|BLUE CROSS|PO BOX 456^CLEVELAND^OH^44130||(800)555-5556|888888|SMITH^JANE^B|987654321|JANE SMITH|19801111|F|456 OAK ST^^CLEVELAND^OH^44130^USA|M|987654321|NONE|20230718130421|1|SELF|20230718130421|20230718130421\r`;

const hl7Message7 = `MSH|^~\\&|ADT1|GOOD HEALTH HOSPITAL|GHH LAB|GHH|20230718130428||ADT^A01|HL7MSG00003|P|2.5\r
EVN|A01|20230718130421|||12345^DOE^JOHN|56789^DOE^JANE\r
PID|1||345678^^^GOOD HEALTH HOSPITAL^MR||JONES^ROBERT^C||19671225|M||2106-3|789 PINE ST^^CLEVELAND^OH^44130^USA||(216)789-0123|(216)789-0123||W||456789123|765-43-2109\r
NK1|1|JONES^MARY^C|WIFE||(216)789-0123\r
PV1|1|I|4000^4042^03||||12345^DOE^JOHN^C||56789^DOE^JANE^C||||||||||PAT|||||||||||||||||||20230718130421\r
AL1|1||^Codeine||Rash\r
DG1|1||I10^Hypertension^I9|||||A\r
PR1|1||P3456^EKG^P\r
GT1|1|345678|JONES^ROBERT^C|789 PINE ST^^CLEVELAND^OH^44130^USA||(216)789-0123|19671225|M|W|456789123|765-43-2109\r
IN1|1|54321|CIGNA|CIGNA|PO BOX 789^CLEVELAND^OH^44130||(800)555-5557|777777|JONES^ROBERT^C|456789123|ROBERT JONES|19671225|M|789 PINE ST^^CLEVELAND^OH^44130^USA|W|456789123|NONE|20230718130421|1|SELF|20230718130421|20230718130421\r`;

const hl7Message8 = `MSH|^~\\&|ADT1|GOOD HEALTH HOSPITAL|GHH LAB|GHH|20230718130428||ADT^A01|HL7MSG00004|P|2.5\r
EVN|A01|20230718130421|||12345^DOE^JOHN|56789^DOE^JANE\r
PID|1||567890^^^GOOD HEALTH HOSPITAL^MR||WILLIAMS^LISA^D||19930515|F||2106-3|101 ELM ST^^CLEVELAND^OH^44130^USA||(216)012-3456|(216)012-3456||S||654321987|654-32-1098\r
NK1|1|WILLIAMS^JAMES^D|FATHER||(216)012-3456\r
PV1|1|O|5000^5052^04||||12345^DOE^JOHN^D||56789^DOE^JANE^D||||||||||PAT|||||||||||||||||||20230718130421\r
AL1|1||^Sulfa||Swelling\r
DG1|1||K21.9^GERD^I9|||||A\r
PR1|1||P7890^Endoscopy^P\r
GT1|1|567890|WILLIAMS^LISA^D|101 ELM ST^^CLEVELAND^OH^44130^USA||(216)012-3456|19930515|F|S|654321987|654-32-1098\r
IN1|1|98765|UNITED HEALTH|UNITED HEALTH|PO BOX 012^CLEVELAND^OH^44130||(800)555-5558|666666|WILLIAMS^LISA^D|654321987|LISA WILLIAMS|19930515|F|101 ELM ST^^CLEVELAND^OH^44130^USA|S|654321987|NONE|20230718130421|1|SELF|20230718130421|20230718130421\r`;

// Call the function to process and print the parsed HL7 messages
processHL7Messages();
