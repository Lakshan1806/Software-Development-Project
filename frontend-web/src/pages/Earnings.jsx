import earnings_pic1 from "../assets/Earnings-pics/earnings-pic1.svg";
import earnings_pic2 from "../assets/Earnings-pics/earnings-pic2.svg";
import earnings_pic3 from "../assets/Earnings-pics/earnings-pic3.svg";
import earnings_pic4 from "../assets/Earnings-pics/earnings-pic4.svg";
import earnings_pic5 from "../assets/Earnings-pics/earnings-pic5.svg";

function Earnings() {
  return (
    <div className="">
      <div className="bg-white px-8 ">
        <div className="flex justify-between py-4">
          <p className="text-black font-bold text-lg">DRIVE</p>
          <p className="text-yellow-600 font-medium cursor-pointer text-lg">
            Go back
          </p>
        </div>

        <div className=" flex-col lg:flex-row justify-between pt-10 lg:pt-20 gap-6 flex items-center">
          <div className="text-justify lg:w-2/7 ml-[60px] ">
            <h1 className="text-[48px] font-bold mb-4 ">
              Your earnings, explained
            </h1>
            <p className="text-black text-[24px] leading-relaxed font-bold">
              There are multiple ways to earn with Urban Move. Scroll down to
              learn how your earnings are calculated and the factors that
              influence how much you can make.
            </p>
          </div>

          <div className="lg:w-5/7">
            <img
              src={earnings_pic1}
              alt="Earnings"
              className="w-[1150px] h-[600px] max-w-[1100px] rounded-[25px] "
            />
          </div>
        </div>
      </div>
      <div className="pt-[156px]">
        <h1 class="text-[36px]  text-center mb-7 font-[700]">
          How much can you make with Urban Move?
        </h1>
        <p className="text-center mb-6 text-[32px] font-[400]">
          Your earnings with the Driver app depend on where, when, and how often
          you choose to drive.
        </p>

        <div className="grid md:grid-cols-2 gap-[248px] p-[99px]">
          <div className=" p-4 rounded-lg">
            <h2 className="text-[32px] font-[700] pl-[120px]">
              Where you drive
            </h2>
            <ul className="list-disc pl-4 mt-2 text-[24px] font-[400] text-justify">
              <li>
                When demand for rides increases in certain areas, you can earn
                more with our Demand Bonus.
              </li>
              <li>
                The Driver app highlights these high-demand zones, so you can
                plan your trips strategically and maximize your earnings.
              </li>
            </ul>
          </div>

          <div className=" p-4 rounded-lg">
            <h2 className="text-[32px] font-[700] pl-[110px]">
              When you're driving
            </h2>
            <ul className="list-disc text-justify pl-4 mt-2 text-[24px] font-[400]">
              <li>
                Choosing the best days and times to go online can make a
                significant difference, and it varies by city.
              </li>
              <li>
                For example, consider going online during commute times for more
                ride requests.
              </li>
            </ul>
          </div>
        </div>

        <div className=" pt-[10px]  rounded-lg mt-6 text-center">
          <h2 className="text-[32px] font-[700]">How much time</h2>
          <p className="mt-2 text-[24px] font-[400]">
            The amount of time you spend online is entirely up to you.
          </p>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-[32px] font-[700] pt-[80px]">
            How are earnings calculated?
          </h2>
          <p className="text-[24px] font-[400]">
            Your payouts are influenced by three key factors: trip fares,
            promotions that provide extra cash, and tips from the riders you
            pick up.
          </p>
        </div>
        <div className=" ">
          <h2 className="text-[32px] font-[700] pt-[80px] ml-[60px]">
            It all starts with fares
          </h2>
          <p className="text-[24px] font-[400] text-center mt-[35px]">
            Fares are the amount you earn for completing a ride, and they vary
            depending on the time, region, or city.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-[96px] p-[99px]">
        <div>
          <div className=" p-4 rounded-lg">
            <div className="center-container ">
              <img
                src={earnings_pic2}
                alt="Earnings"
                className="w-[440px] h-[285px] "
              />
            </div>
            <h2 className="text-[32px] font-[700] text-center">
              Per-minute and per-mile
            </h2>
            <ul className="list-disc pl-4 mt-2 text-[24px] font-[400] text-justify">
              <li>
                In some cities, you'll earn a base fare, plus additional money
                for the time and distance you travel (these rates vary by city).
              </li>
              <li>
                Your earnings will be determined at the end of every trip, based
                on how long and how far you travel.
              </li>
            </ul>
          </div>
        </div>

        <div className=" p-4 rounded-lg">
          <div className="center-container items-center">
            <img
              src={earnings_pic3}
              alt="Earnings"
              className="w-[440px] h-[285px]   "
            />
          </div>
          <h2 className="text-[32px] font-[700] text-center">Upfront Fares</h2>
          <ul className="list-disc pl-4 mt-2 text-[24px] font-[400] text-justify">
            <li>
              In some cities, you can see how much you'll make and where you'll
              go before you accept a trip.
            </li>
            <li>
              Upfront Fares are calculated based on current driving conditions,
              like destination and demand.
            </li>
            <li>
              If there's unexpected traffic and the trip gets a lot longer, your
              fare will increase.
            </li>
          </ul>
        </div>
      </div>
      <div className=" mx-auto p-[156px]">
        <h1 class="text-[36px]  text-center mb-7 font-[700]">
          More factors that impact fares{" "}
        </h1>
        <p className="text-center mb-6 text-[32px] font-[400]">
          Regardless of your city or region, a few additional factors will
          determine how much you'll earn for each ride.
        </p>

        <div className=" p-4 rounded-lg mt-6 text-center">
          <h2 className="text-[32px] font-[700]">Reservations</h2>
          <p className="mt-2 text-[24px] font-[400]">
            Make extra money by accepting rides that passengers book in advance.{" "}
          </p>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-[32px] font-[700]">Cancellations </h2>
          <p className="text-[24px] font-[400]">
            If a rider cancels after you've begun driving toward them, a
            cancellation fee is charged to the rider, and you're compensated for
            the inconvenience.
          </p>
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-[32px] font-[700]">Tolls</h2>
          <p className="text-[24px] font-[400]">
            When your vehicle incurs a qualifying toll or surcharge during a
            trip, the toll amount is added to the rider's fare and reimbursed to
            you.
          </p>
        </div>
      </div>
      <div className="mt-6  ">
        <h2 className="text-[32px] font-[700] ml-[60px]">
          Next, add in promotions
        </h2>
        <p className="text-[24px] font-[400] ml-[90px]">
          Promotions are a simple way to boost your earnings. Check the Driver
          app to stay updated on the latest promotions available to you.
        </p>
        <div className="flex gap-[380px] justify-center items-center mt-[40px] ml-[180px] ">
          <div className="lg:w-1/2 pr-30">
            <img
              src={earnings_pic4}
              alt="Earnings"
              className="w-[420px] h-[550px] "
            />
          </div>
          <div className="lg:w-1/2 pr-30">
            <img
              src={earnings_pic5}
              alt="Earnings"
              className="w-[420px] h-[550px]"
            />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 p-[99px]">
        <div className=" p-4 rounded-lg">
          <h2 className="text-[32px] font-[700] text-center">Demand Bonus</h2>
          <ul className="list-disc pl-4 mt-2 text-[24px] font-[400] text-justify">
            <li>When demand increases, earnings for rides go up.</li>
            <li>
              Look out for Demand Bonus zones in the Driver app to boost your
              income during peak times.
            </li>
          </ul>
        </div>

        <div className=" p-4 rounded-lg">
          <h2 className="text-[32px] font-[700] text-center">Quests</h2>
          <ul className="list-disc pl-4 mt-2 text-[24px] font-[400]">
            <li>
              Earn extra by completing a set number of trips within a specified
              time.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Earnings;
