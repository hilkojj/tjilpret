package com.hilkojj.tjilpret.activities.loginregister

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.support.constraint.ConstraintLayout
import android.support.v4.view.ViewPager
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.view.animation.AccelerateInterpolator
import android.view.animation.Animation
import android.view.animation.Transformation
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import android.widget.ImageView
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.UserSession
import com.hilkojj.tjilpret.activities.home.HomeActivity
import com.hilkojj.tjilpret.activities.utils.SnackbarUtils
import com.hilkojj.tjilpret.activities.utils.ViewPagerAdapter




class LoginRegisterActivity : AppCompatActivity() {

    lateinit var viewPager: ViewPager

    private lateinit var loginFragment: LoginFragment
    private lateinit var registerFragment: RegisterFragment
    private lateinit var logo: ImageView

    lateinit var loginUsername: EditText
    lateinit var loginPassword: EditText
    lateinit var registerUsername: EditText
    lateinit var registerPassword: EditText
    lateinit var registerMail: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login_register)

        logo = findViewById(R.id.login_register_logo)
        viewPager = findViewById(R.id.login_register_viewpager)

        val adapter = object : ViewPagerAdapter(supportFragmentManager) {

            override fun getPageWidth(position: Int): Float {
                val displayMetrics = viewPager.resources.displayMetrics
                val dpWidth = displayMetrics.widthPixels / displayMetrics.density
                return 1f - (48 / dpWidth)
            }

        }

        loginFragment = LoginFragment()
        registerFragment = RegisterFragment()
        loginFragment.activity = this
        registerFragment.activity = this

        adapter.addFragment(loginFragment, "inlogguh")
        adapter.addFragment(registerFragment, "registeruh")

        viewPager.adapter = adapter

        val layoutParams = logo.layoutParams as ConstraintLayout.LayoutParams
        layoutParams.horizontalBias = viewPager.adapter.getPageWidth(0) / 2
        logo.layoutParams = layoutParams
    }

    fun showPage(index: Int) {

        val view = findViewById<View>(android.R.id.content)

        view.requestFocus()
        val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(view.windowToken, 0)

        viewPager.setCurrentItem(index, true)
        (if (index == 0) registerFragment else loginFragment).showTab()

        val anim = object : Animation() {

            override fun applyTransformation(interpolatedTime: Float, t: Transformation?) {

                val layoutParams = logo.layoutParams as ConstraintLayout.LayoutParams
                var newBias = viewPager.adapter.getPageWidth(0) / 2
                if (index == 1)
                    newBias = 1 - newBias

                layoutParams.horizontalBias =
                        interpolatedTime * newBias + (1 - interpolatedTime) * layoutParams.horizontalBias

                logo.layoutParams = layoutParams
            }

        }
        anim.duration = 2000
        anim.interpolator = AccelerateInterpolator(.1f)
        logo.startAnimation(anim)
    }

    fun login(view: View) {

        if (Tjilpret.userSession != null) {
            SnackbarUtils.errorSnackbar(view, "Je ben al inglogt", 5000)
            return
        }

        Tjilpret.FIREBASE_FUNCS.getHttpsCallable("login").call(
                hashMapOf(
                        "username" to loginUsername.text.toString(),
                        "password" to loginPassword.text.toString()
                )
        ).continueWith { task ->

            val data = task.result.data as HashMap<*, *>
            if (data["success"] == true) {
                Tjilpret.userSession = UserSession(data["username"] as String, data["token"] as String)
                startActivity(Intent(this, HomeActivity::class.java))
                finish()
            } else
                SnackbarUtils.errorSnackbar(view, data["error"] as String, 4000)
        }
    }

    fun register(view: View) {

        if (Tjilpret.userSession != null) {
            SnackbarUtils.errorSnackbar(view, "Je ben al inglogt huh wtf", 5000)
            return
        }

        Tjilpret.FIREBASE_FUNCS.getHttpsCallable("createUser").call(
                hashMapOf(
                        "username" to registerUsername.text.toString(),
                        "password" to registerPassword.text.toString(),
                        "mail" to registerMail.text.toString()
                )
        ).continueWith { task ->

            val data = task.result.data as HashMap<*, *>
            if (data["success"] == true) {
                Tjilpret.userSession = UserSession(data["username"] as String, data["token"] as String)
                startActivity(Intent(this, HomeActivity::class.java))
                finish()
            } else
                SnackbarUtils.errorSnackbar(view, data["error"] as String, 4000)
        }

    }

}
