package com.hilkojj.tjilpret

import android.content.SharedPreferences
import android.content.res.Resources

/**
 * Created by Hilko on 14-May-18.
 */
object Tjilpret {

    const val URL = "https://tjilpret.tk/"

    lateinit var resources: Resources
    lateinit var prefs: SharedPreferences

    var userSession: UserSession? = null

}