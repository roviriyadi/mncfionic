import { ScreenOrientation } from "@ionic-native/screen-orientation";

export class ChangeOrientation {

  static onLandscape(screenOrientation: ScreenOrientation){
    if(screenOrientation.type === screenOrientation.ORIENTATIONS.PORTRAIT){
      screenOrientation.lock(screenOrientation.ORIENTATIONS.LANDSCAPE);
    }else if(screenOrientation.type === screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY){
      screenOrientation.lock(screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
    }if(screenOrientation.type === screenOrientation.ORIENTATIONS.PORTRAIT_SECONDARY){
      screenOrientation.lock(screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY);
    }
  }

  static onPortrait(screenOrientation: ScreenOrientation){
    if(screenOrientation.type === screenOrientation.ORIENTATIONS.LANDSCAPE){
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
    }else if(screenOrientation.type === screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY){
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    }else if(screenOrientation.type === screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY){
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT_SECONDARY);
    }
  }
}