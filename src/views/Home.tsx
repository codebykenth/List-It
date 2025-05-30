import Header from "../components/Header";
import Navigation from "../components/Navigation";
import FacebookLogo from "../assets/images/Facebook_Logo_Primary.png";

export default function Home() {
  return (
    <div>
      <Navigation />
      <Header email="johndoe@email.com" />
      <div className="bg-slate-200 p-2 space-y-2">
        <div className=" w-full flex justify-between">
          <label htmlFor="" className="w-1/3">
            Category
          </label>
          <select name="category" id="" className="w-2/3">
            <option value="All">All</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health/Fitness">Health/Fitness</option>
            <option value="Shopping">Shopping</option>
            <option value="Home">Home</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
            <option value="Hobbies">Hobbies</option>
            <option value="Social">Social</option>
            <option value="Errands">Errands</option>
            <option value="Events">Events</option>
            <option value="Goals">Goals</option>
            <option value="Miscellaneous">Miscellaneous</option>
            <option value="Family">Family</option>
            <option value="Projects">Projects</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Self-Care">Self-Care</option>
            <option value="Pets">Pets</option>
            <option value="Appointments">Appointments</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className=" w-full flex justify-between">
          <label htmlFor="" className="w-1/3">
            Priority
          </label>
          <select name="priority" id="" className="w-2/3">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* All Tasks */}
      <h1 className="p-2 text-2xl">All Tasks</h1>
      <p className="text-red-700 italic px-2">No task added</p>

      <div className="shadow-2xs border-1 p-2 m-2 border-slate-800">
        <div className="flex justify-between">
          {/* Card Title */}
          <div>Task Title</div>
          <div>Due: 09/02/25</div>
        </div>
        {/* Card Image */}
        <div className="flex justify-center">
          <img
            src={FacebookLogo}
            alt="Task Image"
            className="size-52 object-cover"
          />
        </div>

        <p>
          {/* Card Descriptions */}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
          suscipit corrupti at dicta incidunt eos laborum earum debitis nemo
          repellendus enim hic, sunt quia voluptas consequuntur magni ex maxime
          fuga.
        </p>
      </div>
      <button
        type="button"
        className="bg-slate-300 text-slate-900 text-2xl rounded-full size-16 flex justify-center items-center absolute bottom-0 right-0 mb-1 mr-1"
      >
        +
      </button>
    </div>
  );
}
