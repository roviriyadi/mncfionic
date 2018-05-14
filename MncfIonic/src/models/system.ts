import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class System {

    @JsonProperty("i_d", String, false)
    _id: string;

    @JsonProperty("userTerakhir", String, false)
    userTerakhir: string;

    @JsonProperty("loginOtomatis", Boolean, false)
    loginOtomatis: boolean;

}