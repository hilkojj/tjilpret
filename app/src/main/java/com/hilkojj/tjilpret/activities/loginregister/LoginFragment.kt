package com.hilkojj.tjilpret.activities.loginregister

import android.os.Bundle
import android.support.constraint.ConstraintLayout
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.hilkojj.tjilpret.R

class LoginFragment : LoginRegisterFragment(0) {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_login, container, false)
    }

    override fun getTab(): ConstraintLayout {
        return view!!.findViewById(R.id.login_tab) as ConstraintLayout
    }

}
