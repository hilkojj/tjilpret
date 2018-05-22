package com.hilkojj.tjilpret.activities

import android.support.v7.app.AppCompatActivity
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.UserSession

abstract class UserSessionActivity : AppCompatActivity() {

    val session: UserSession = Tjilpret.userSession!!

    fun valid(): Boolean {
        return Tjilpret.userSession == session
    }

}