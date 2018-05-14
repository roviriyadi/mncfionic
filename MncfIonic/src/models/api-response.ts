import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ApiResponse {

    @JsonProperty("success", Boolean, false)
    success: boolean;

    @JsonProperty("message", String, false)
    message: string;  
    
    @JsonProperty("data", Object, false)
    data: object;

}