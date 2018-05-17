package com.hilkojj.tjilpret.activities.loginregister

import android.graphics.drawable.AnimationDrawable
import android.support.constraint.ConstraintLayout
import android.support.v4.app.Fragment

abstract class LoginRegisterFragment: Fragment() {

    override fun onStart() {

        super.onStart()

        val constraintLayout = view as ConstraintLayout
        val animationDrawable = constraintLayout.background as AnimationDrawable
        animationDrawable.setEnterFadeDuration(2000)
        animationDrawable.setExitFadeDuration(4000)
        animationDrawable.start()
    }

}