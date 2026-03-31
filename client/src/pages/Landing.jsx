export default function Landing() {
  return (
    <div className="landing">
      <h1>Master XML Skills</h1>
      <p>
        Learn XML from the ground up with interactive lessons, hands-on coding
        exercises, and quizzes. Track your progress and earn achievements as you
        build real-world XML expertise.
      </p>
      <div className="auth-buttons">
        <a href="/auth/google" className="btn btn-primary">Sign in with Google</a>
        <a href="/auth/github" className="btn btn-outline">Sign in with GitHub</a>
      </div>
    </div>
  );
}
