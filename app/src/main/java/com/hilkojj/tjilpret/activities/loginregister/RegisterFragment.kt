package com.hilkojj.tjilpret.activities.loginregister

import android.os.Bundle
import android.support.constraint.ConstraintLayout
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.hilkojj.tjilpret.R

class RegisterFragment : LoginRegisterFragment(1) {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_register, container, false)
    }

    override fun getTab(): ConstraintLayout {
        return view!!.findViewById(R.id.register_tab) as ConstraintLayout
    }

}
