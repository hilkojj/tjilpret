package com.hilkojj.tjilpret.activities.loginregister

import android.os.Bundle
import android.support.constraint.ConstraintLayout
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import com.hilkojj.tjilpret.R

class LoginFragment : LoginRegisterFragment(0) {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_login, container, false)
    }

    override fun onStart() {
        super.onStart()

        activity.username = activity.findViewById(R.id.loginUsername)
        activity.password = activity.findViewById(R.id.loginPassword)

        activity.password.setOnEditorActionListener { _, actionID, _ ->
            if (actionID == EditorInfo.IME_ACTION_DONE) {

                activity.login(activity.username)
                return@setOnEditorActionListener true
            }
            return@setOnEditorActionListener false
        }
    }

    override fun getTab(): ConstraintLayout {
        return view!!.findViewById(R.id.login_tab) as ConstraintLayout
    }

}
