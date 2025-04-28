import AccountInfo from "../components/Account/AccountInfo";

function Account() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px] flex-none">
        Account
      </h1>
      <div className="grid grid-cols-12 grid-rows-12 gap-3 flex-1 min-h-0">
        <AccountInfo />
      </div>
    </div>
  );
}

export default Account;
