function Drive4thpage() {
  const styles3 = "text-center text-[32px] font-[700] p-2  ";
  const styles4 = " text-left text-[20px] font-[500] ";
  return (
    <div className="grid grid-cols-3 gap-[100px] items-start">
      <div>
        <p className={styles3}>Protection on every trip</p>
        <div className={styles4}>
          <ul className="list-disc list-outside ">
            <li>
              For every trip you complete using the Driver app, we provide auto
              insurance coverage to ensure the safety and protection of both you
              and your rider.
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p className={styles3}>Help if you need it</p>
        <div className={styles4}>
          <ul className="list-disc list-outside">
            <li>
              The Emergency Button connects you directly to 119, allowing you to
              get help quickly.
            </li>
            <li>
              The app also displays your trip details, making it easy to share
              crucial information with authorities when needed.
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p className={styles3}> Community Guidelines</p>
        <div className={styles4}>
          <ul className="list-disc list-outside">
            <li>
              Our standards are designed to ensure safe connections and foster
              positive interactions for everyone.
            </li>
            <li>
              Discover how these guidelines apply to you and enhance your
              experience.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Drive4thpage;
