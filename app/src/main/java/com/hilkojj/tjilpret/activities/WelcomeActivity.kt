package com.hilkojj.tjilpret.activities

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.support.v7.app.AppCompatActivity
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.activities.loginregister.LoginRegisterActivity

class WelcomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        Tjilpret.prefs = getSharedPreferences("tjilpret.prefs", Context.MODE_PRIVATE)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_welcome)

        Handler().postDelayed({

            startActivity(Intent(this, LoginRegisterActivity::class.java))
            finish()

        }, 1000)

    }

}
