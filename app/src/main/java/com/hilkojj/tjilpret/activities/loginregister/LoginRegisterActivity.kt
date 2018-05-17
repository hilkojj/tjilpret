package com.hilkojj.tjilpret.activities.loginregister

import android.os.Bundle
import android.support.v4.view.ViewPager
import android.support.v7.app.AppCompatActivity
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.activities.utils.ThemeColors
import com.hilkojj.tjilpret.activities.utils.ViewPagerAdapter
import java.util.*

class LoginRegisterActivity : AppCompatActivity() {

    lateinit var viewPager: ViewPager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ThemeColors(this, Random().nextInt(255), Random().nextInt(255), Random().nextInt(255))
        setContentView(R.layout.activity_login_register)

        viewPager = findViewById(R.id.login_register_viewpager)

        val adapter = object: ViewPagerAdapter(supportFragmentManager) {

            override fun getPageWidth(position: Int): Float {
                return .9f
            }

        }

        adapter.addFragment(LoginFragment(), "inlogguh")
        adapter.addFragment(RegisterFragment(), "registeruh")

        viewPager.adapter = adapter
    }

}
