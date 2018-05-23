package com.hilkojj.tjilpret.activities

import android.content.Context
import android.content.Intent
import android.graphics.drawable.Animatable
import android.os.Bundle
import android.os.Handler
import android.support.v7.app.AppCompatActivity
import android.widget.ImageView
import com.android.volley.toolbox.Volley
import com.hilkojj.tjilpret.API
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.activities.chooseuser.ChooseUserActivity
import com.hilkojj.tjilpret.activities.home.HomeActivity
import com.hilkojj.tjilpret.activities.loginregister.LoginRegisterActivity
import org.json.JSONObject

class WelcomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        Tjilpret.prefs = getSharedPreferences("tjilpret.prefs", Context.MODE_PRIVATE)
        Tjilpret.resources = resources
        API.requestQueue = Volley.newRequestQueue(applicationContext)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_welcome)

        val logo: ImageView = findViewById(R.id.welcome_logo)
        val drawable = logo.drawable as Animatable
        drawable.start()

        Handler().postDelayed({

            if (Tjilpret.userSession == null) {
                val aClass = if (Tjilpret.prefs.getStringSet("stored_users", mutableSetOf()).size == 0)
                    LoginRegisterActivity::class.java
                else
                    ChooseUserActivity::class.java
                startActivity(Intent(this, aClass))
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
            } else
                startActivity(Intent(this, HomeActivity::class.java))

            finish()
        }, 1000)
    }

}
