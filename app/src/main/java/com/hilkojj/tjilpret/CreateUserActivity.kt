package com.hilkojj.tjilpret

import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.EditText

class CreateUserActivity : AppCompatActivity() {

    lateinit var usernameInput: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_user)

        usernameInput = findViewById(R.id.createUsername)
        usernameInput.setOnFocusChangeListener({ view, hasFocus ->

            if (hasFocus)
                return@setOnFocusChangeListener

            val username = usernameInput.text.toString()
            if (username.isNotEmpty()) {

                Tjilpret.FIREBASE_FUNCS.getHttpsCallable("userExists").call(
                        hashMapOf("username" to username)
                ).continueWith { task ->

                    val data = task.result.data as HashMap<*, *>
                    if (data["exists"] == true)
                        Snackbar.make(view, "$username bestaat al !!?!", 3000).show()
                    else
                        Snackbar.make(view, "$username is beschrikbar", 1000).show()
                }
            }
        })

    }

    fun create(view: View) {

        val username = usernameInput.text.toString()
        val password = findViewById<EditText>(R.id.createPassword).text.toString()
        val mail = findViewById<EditText>(R.id.createPassword).text.toString()

        Tjilpret.FIREBASE_FUNCS.getHttpsCallable("createUser").call(

                hashMapOf(
                        "username" to username,
                        "password" to password,
                        "mail" to mail
                )

        ).continueWith { task ->

            val data = task.result.data as HashMap<*, *>

            if (data["success"] == true) {

                System.out.println("aangemaakt")

                Tjilpret.userSession = UserSession(data["username"] as String, password)

            } else {

                val error = data["error"] as String
                System.out.println("niet aangemaakt want $error")
                Snackbar.make(view, error, 4000).show()
            }
        }
    }

}
