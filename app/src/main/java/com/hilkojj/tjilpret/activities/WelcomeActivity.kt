package com.hilkojj.tjilpret.activities

import android.content.Context
import android.content.Intent
import android.graphics.drawable.Animatable
import android.os.Bundle
import android.os.Handler
import android.support.v7.app.AppCompatActivity
import android.widget.ImageView
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.activities.loginregister.LoginRegisterActivity

class WelcomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        Tjilpret.prefs = getSharedPreferences("tjilpret.prefs", Context.MODE_PRIVATE)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_welcome)

        val logo: ImageView = findViewById(R.id.welcome_logo)
        val drawable = logo.drawable as Animatable
        drawable.start()

        Handler().postDelayed({

            startActivity(Intent(this, LoginRegisterActivity::class.java))
            finish()

        }, 1200)

    }

}
