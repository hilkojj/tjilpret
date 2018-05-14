package com.hilkojj.tjilpret

import android.os.Bundle
import android.support.v7.app.AppCompatActivity

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        Tjilpret.FIREBASE_FUNCS.getHttpsCallable("createUser").call(

                hashMapOf(
                        "username" to "heenk ",
                        "password" to "hoi122"
                )

        ).continueWith { task ->

            System.out.println(task.result.data)

        }

    }
}
