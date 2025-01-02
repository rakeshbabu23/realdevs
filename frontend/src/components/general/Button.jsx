import React from "react";

function Button({ text, action, styles }) {
  return (
    <button
      class={`text-purple-600 font-jost font-medium py-2 px-4 rounded-md border-x-[1px] border-t-[1px] bg-black border-b-4 border-purple-600 shadow-lg hover:border-b-2 hover:border-x-[1px] hover:border-t-[1px] hover:mt-1 transition-all ${styles}`}
      onClick={action}
    >
      {text}
    </button>
  );
}

export default Button;
