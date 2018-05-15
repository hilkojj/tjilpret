package com.hilkojj.tjilpret

import android.content.Intent
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.EditText

class LoginActivity : AppCompatActivity() {

    lateinit var username: EditText
    lateinit var password: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        username = findViewById(R.id.loginUsername)
        password = findViewById(R.id.loginPassword)
    }

    fun login(view: View) {

        val passwordString = password.text.toString()

        Tjilpret.FIREBASE_FUNCS.getHttpsCallable("login").call(
                hashMapOf(
                        "username" to username.text.toString(),
                        "password" to passwordString
                )
        ).continueWith { task ->

            val data = task.result.data as HashMap<*, *>
            if (data["success"] == true)
                Tjilpret.userSession = UserSession(data["username"] as String, passwordString)
            else
                Snackbar.make(view, data["error"] as String, 4000).show()
        }
    }

    fun showCreateActivity(view: View) {
        startActivity(Intent(this, CreateUserActivity::class.java))
        finish()
    }

}
