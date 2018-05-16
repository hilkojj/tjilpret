package com.hilkojj.tjilpret.activities

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import com.hilkojj.tjilpret.R

class BaseSessionActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_base_session)
    }

}
