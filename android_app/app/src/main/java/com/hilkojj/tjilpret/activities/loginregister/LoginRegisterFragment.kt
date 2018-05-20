package com.hilkojj.tjilpret.activities.loginregister

import android.graphics.drawable.AnimationDrawable
import android.support.constraint.ConstraintLayout
import android.support.v4.app.Fragment
import android.view.animation.AccelerateInterpolator
import android.widget.ScrollView

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

    abstract fun getForm(): ScrollView

    fun hideTab() {
        animation(0f, 1f)
    }

    fun showTab() {
        animation(1f, 0f)
    }

    private fun animation(tabAlpha: Float, formAlpha: Float) {
        getTab().animate().alpha(tabAlpha).setDuration(100).interpolator = AccelerateInterpolator(2f)
        getForm().animate().alpha(formAlpha).setDuration(200).interpolator = AccelerateInterpolator(2f)
    }

}