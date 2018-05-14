import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ApprovalSyncLevel {

    @JsonProperty("currentLevel", Number, false)
    currentLevel: number

    @JsonProperty("currentUser", String, false)
    currentUser: string;

    @JsonProperty("yourResult", String, false)
    yourResult: string;

}