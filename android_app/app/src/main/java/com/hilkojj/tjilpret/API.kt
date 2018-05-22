package com.hilkojj.tjilpret

import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import org.json.JSONObject


object API {

    const val API_URL = "https://tjilpret.tk/api/"

    lateinit var requestQueue: RequestQueue

    fun post(
            url: String,
            data: HashMap<String, *>,
            successCallback: (JSONObject) -> Unit,
            errorCallback: (() -> Unit)?) {

        val postRequest = object : JsonObjectRequest(
                API_URL + url,
                JSONObject(data),
                Response.Listener<JSONObject> { response ->
                    successCallback(response)
                },
                Response.ErrorListener { error ->
                    System.err.println(error.message)
                    errorCallback?.invoke()
                }
        ) {
            override fun getHeaders(): MutableMap<String, String> {
                return hashMapOf("Content-Type" to "application/json")
            }
        }
        requestQueue.add(postRequest)
    }


}