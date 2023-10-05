import { Link } from "react-router-dom";

export default function GeneralQueries() {
  return (
    <>
      <div className="m-10">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="bg-mylight  m-5 p-3 rounded-lg">
              <div className="bg-white p-5 rounded-md">
                <div className="grid grid-cols-2 my-2">
                  <p>Name</p>
                  <p>Mano Sundar</p>
                </div>
                <div className="grid grid-cols-2 my-2">
                  <p>Query About</p>
                  <p>Application Feedback</p>
                </div>
                <div className="flex items-center justify-center  mt-7">
                  <Link
                    className="border-black border-2 px-3 py-1 rounded-sm "
                    to="/admin/generalqueries/:id"
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
}
