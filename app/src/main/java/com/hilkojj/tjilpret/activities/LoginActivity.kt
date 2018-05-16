package com.hilkojj.tjilpret.activities

import android.content.Intent
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.EditText
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.UserSession

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

        if (Tjilpret.userSession != null) {
            Snackbar.make(view, "Fout: je bent al ingelogd", 5000).show()
            return
        }

        val passwordString = password.text.toString()

        Tjilpret.FIREBASE_FUNCS.getHttpsCallable("login").call(
                hashMapOf(
                        "username" to username.text.toString(),
                        "password" to passwordString
                )
        ).continueWith { task ->

            val data = task.result.data as HashMap<*, *>
            if (data["success"] == true)
                Tjilpret.userSession = UserSession(data["username"] as String, data["token"] as String)
            else
                Snackbar.make(view, data["error"] as String, 4000).show()
        }
    }

    fun showCreateActivity(view: View) {
        startActivity(Intent(this, CreateUserActivity::class.java))
        finish()
    }

}
