import { Link } from "react-router-dom";

const TieUpConfiguration = () => {
  return (
    <>
      <div className="m-10">
        <div className="flex items-center justify-end bg-mylight p-3 rounded-md">
          <Link
            to="/admin/tieup"
            className="bg-black  text-white px-3 py-2 rounded-md "
          >
            Add Tie Up
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="bg-mylight w-8/12  m-5 p-3 rounded-lg">
              <div className="bg-white p-5  rounded-md">
                <div className="w-full items-center justify-center text-center">
                  <div className="grid grid-cols-2">
                    <div className="flex my-2">
                      <p className="font-semibold">Partner Type</p>
                      <p className="ml-5">College</p>
                    </div>
                    <div className="flex my-2">
                      <p className="font-semibold">Partner Name</p>
                      <p className="ml-5">Insitute Name</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center  mt-7">
                  <Link
                    className="border-black border-2 px-3 py-1 rounded-sm "
                    to="/admin/tieup/:id"
                  >
                    <p className="text-[16px]">View Details</p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default TieUpConfiguration;
