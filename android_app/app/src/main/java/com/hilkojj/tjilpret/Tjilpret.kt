package com.hilkojj.tjilpret

import android.content.SharedPreferences
import android.content.res.Resources

/**
 * Created by Hilko on 14-May-18.
 */
object Tjilpret {

    lateinit var resources: Resources
    lateinit var prefs: SharedPreferences

    var userSession: UserSession? = null

}