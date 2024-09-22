package com.yourappname

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.wearable.DataClient
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.Wearable

class WearOSModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), DataClient.OnDataChangedListener {

    init {
        // Register the Wear OS DataClient listener
        Wearable.getDataClient(reactContext).addListener(this)
    }

    override fun getName(): String {
        return "WearOSModule"
    }

    override fun onDataChanged(dataEvents: DataEventBuffer) {
        //alert event
        Log.d("WearOSModule", "Data changed")
        Log.d("WearOSModule", dataEvents.toString())

        Alert.alert("Data changed")
        Alert.alert(dataEvents.toString())

        for (event in dataEvents) {
            if (event.type == DataEvent.TYPE_CHANGED) {
                val path = event.dataItem.uri.path
                if (path == "/score") {
                    val dataMapItem = DataMapItem.fromDataItem(event.dataItem)
                    val score = dataMapItem.dataMap.getInt("score")

                    // Pass score to React Native
                    sendScoreToReactNative(score)
                }
            }
        }
    }

    private fun sendScoreToReactNative(score: Int) {
        val params: WritableMap = Arguments.createMap()
        params.putInt("score", score)
        sendEvent(reactApplicationContext, "scoreUpdated", params)
    }

    private fun sendEvent(reactContext: ReactApplicationContext, eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
