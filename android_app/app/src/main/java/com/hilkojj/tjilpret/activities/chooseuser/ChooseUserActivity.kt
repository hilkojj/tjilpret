package com.hilkojj.tjilpret.activities.chooseuser

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.AnimationDrawable
import android.os.Bundle
import android.support.v4.content.ContextCompat.startActivity
import android.support.v7.app.AppCompatActivity
import android.support.v7.widget.DefaultItemAnimator
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateInterpolator
import android.widget.ProgressBar
import android.widget.TextView
import com.hilkojj.tjilpret.*
import com.hilkojj.tjilpret.activities.home.HomeActivity
import com.hilkojj.tjilpret.activities.loginregister.LoginRegisterActivity
import org.json.JSONObject

class ChooseUserActivity : AppCompatActivity() {

    inner class ChooseUserAdapter : RecyclerView.Adapter<ChooseUserAdapter.ViewHolder>() {

        val pairs = ArrayList<Pair<User, Int>>()
        val viewsPairs = HashMap<ViewHolder, Pair<User, Int>>()

        inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

            var usernameView: TextView = itemView.findViewById(R.id.choose_user_row_username)

            init {
                itemView.setOnClickListener { choose(viewsPairs[this]!!) }
            }

        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            return ViewHolder(
                    LayoutInflater.from(parent.context).inflate(R.layout.row_choose_user, parent, false)
            )
        }

        override fun getItemCount(): Int {
            return pairs.size
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            viewsPairs[holder] = pairs[position]
            val user = pairs[position].first
            holder.usernameView.text = user.username
            holder.usernameView.setTextColor(Color.rgb(user.r, user.g, user.b))
        }

    }

    private var chosen = false
    lateinit var recyclerView: RecyclerView
    lateinit var adapter: ChooseUserAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_choose_user)

        val animationDrawable = findViewById<View>(R.id.choose_user_view).background as AnimationDrawable
        animationDrawable.setEnterFadeDuration(2000)
        animationDrawable.setExitFadeDuration(4000)
        animationDrawable.start()

        recyclerView = findViewById(R.id.choose_user_recycler)
        recyclerView.layoutManager = LinearLayoutManager(applicationContext)
        recyclerView.itemAnimator = DefaultItemAnimator()
        adapter = ChooseUserAdapter()
        recyclerView.adapter = adapter

        val tokens = HashMap<String, Int>()
        val storedUsers = Tjilpret.prefs.getStringSet("stored_users", setOf())

        for (userID in storedUsers) try {
            tokens[userID] = Tjilpret.prefs.getInt("user_token->$userID", 0)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        API.post("validateTokens", hashMapOf("tokens" to JSONObject(tokens)), { response ->

            findViewById<ProgressBar>(
                    R.id.choose_user_progress_bar
            ).animate().setDuration(200).alpha(0f)

            val remove = ArrayList<String>()

            for (userID in storedUsers) if (response.has(userID)) {

                adapter.pairs.add(Pair(User(response.getJSONObject(userID)), tokens[userID]!!))

            } else remove.add(userID)

            storedUsers.removeAll(remove)
            with(Tjilpret.prefs.edit()) {
                putStringSet("stored_users", storedUsers)
                apply()
            }
            adapter.notifyDataSetChanged()
            recyclerView.animate().alpha(1f).setDuration(200).interpolator = AccelerateInterpolator(2f)

        }, null)
    }

    fun addAnother(view: View) {
        if (chosen)
            return
        chosen = true
        startActivity(Intent(this, LoginRegisterActivity::class.java))
        finish()
    }

    fun choose(pair: Pair<User, Int>) {
        if (chosen)
            return
        chosen = true
        Tjilpret.userSession = UserSession(pair.first, pair.second)
        startActivity(Intent(this, HomeActivity::class.java))
        finish()
    }

}
