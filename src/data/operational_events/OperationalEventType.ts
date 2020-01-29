export const enum OperationalEventType {
    HiddenRecord = "hidden", // не показываются
    AutoRecord = "auto",
    ManualRecord = "manual", // ручная запись
    Incident = "incident", // создается нотификация
    Resolution = "resolution" // резолюция на нотификацию
}
