package com.hilkojj.tjilpret.activities.loginregister

import android.graphics.drawable.AnimationDrawable
import android.support.constraint.ConstraintLayout
import android.support.v4.app.Fragment
import android.view.animation.AccelerateInterpolator

abstract class LoginRegisterFragment(private val index: Int) : Fragment() {

    lateinit var activity: LoginRegisterActivity

    override fun onStart() {

        super.onStart()

        val constraintLayout = view as ConstraintLayout
        val animationDrawable = constraintLayout.background as AnimationDrawable
        animationDrawable.setEnterFadeDuration(2000)
        animationDrawable.setExitFadeDuration(4000)
        animationDrawable.start()

        getTab().setOnClickListener {
            activity.showPage(index)
            hideTab()
        }
    }

    abstract fun getTab(): ConstraintLayout

    fun hideTab() {
        getTab().animate().alpha(0f).setDuration(100).interpolator = AccelerateInterpolator(2f)
    }

    fun showTab() {
        getTab().animate().alpha(1f).interpolator = AccelerateInterpolator(2f)
    }

}