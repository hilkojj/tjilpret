package com.hilkojj.tjilpret

import android.content.SharedPreferences
import com.google.android.gms.tasks.Task
import com.google.firebase.functions.FirebaseFunctions
import com.google.firebase.functions.HttpsCallableResult

/**
 * Created by Hilko on 14-May-18.
 */
object Tjilpret {

    val FIREBASE_FUNCS: FirebaseFunctions = FirebaseFunctions.getInstance()

    var userSession: UserSession? = null

    lateinit var prefs: SharedPreferences

    fun callHttpsFunction(name: String, data: HashMap<String, Any>): Task<HttpsCallableResult> {
        if (userSession != null) {
            data["username"] = userSession!!.username
            data["token"] = userSession!!.token
        }
        return FIREBASE_FUNCS.getHttpsCallable(name).call(data)
    }

    fun removeStoredUser(username: String) {

        val storedUsers = Tjilpret.prefs.getStringSet("stored_users", mutableSetOf())
        storedUsers.remove(username)

        with(Tjilpret.prefs.edit()) {
            putStringSet("stored_users", storedUsers)
            remove("user_token->$username")
            apply()
        }
        println("removed user $username from prefs")
    }

}