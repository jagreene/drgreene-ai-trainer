import JSZip from 'jszip';

export const stripFile = (file) => {
  let split = file.split("/");
  return split[split.length-1].slice(0,-5);
};

export const genTree = (files) => files.reduce((acc, file) => ({...file, ...acc}), {})

export const format = (directory) => {
  const files = directory.files
  return Object.keys(files).map(name => {
    let file = files[name];
    file.name = stripFile(name);
    return file;
  })
};

export const inflate = (zipFile) => {
  if (zipFile.name !== "app") {
    return zipFile.async("string")
    .then(content => {
      return {[zipFile.name]: JSON.parse(content).data}
    })
  } else {
    return zipFile.async("string")
    .then(content => {
      return {[zipFile.name]: JSON.parse(content)}
    })
  }
};

export const extract = (arrayBuffer) => {
  return JSZip.loadAsync(arrayBuffer)
    .then(directory => {
      return Promise.all(format(directory).map(file =>
        inflate(file)))
    })
    .then(files => genTree(files))
};

export const formatFile = (data) => ({data})
export const formatName = (name) => {
  name = name === "intent" ? "entities/intent" : name;
  return `${name}.json`;
}

const addZipFile = (name, data) => (archive) => {
  console.log("ADDDING: ", name, archive);
  return JSZip.loadAsync(archive, {'base64': true})
  .then(zip => {
    zip.file(name, JSON.stringify(data, null, '  ').replace(/:/g, " :"), {createFolders: false});
    return zip.generateAsync({type: "base64", compression: "DEFLATE"})
  })
}

const waterFall = (chain, seed) => {
  return chain.reduce((prev, curr) => {
    return prev.then(curr);
  }, Promise.resolve(seed))
}

export const zipTree = (fileTree) => {
  const archiveOrder = ["app", "intent", "actions", "stories", "expressions"];
  let zipPromiseChain = archiveOrder.map((fileName) => {
    let data = fileTree[fileName];
    const name = formatName(fileName);
    data = name !== "app.json" ? formatFile(data) : data;
    return addZipFile(name, data)
  })

  console.log(zipPromiseChain);

  waterFall(zipPromiseChain, new JSZip().generateAsync({type:"base64"}))
  .then(content => {
    window.location = "data:application/zip;base64," + content;
  });
};

export default extract;




// Object.entries(fileTree).forEach(([name, data]) => {
//   name = formatName(name);
//   data = name !== "app.json" ? formatFile(data) : data;
//   folder.file(name, JSON.stringify(data, null, '  ').replace(/:/g, " :"), {createFolders: false});
// });

// folder.generateAsync({type: "base64"})
//   .then((content) => {
//     console.log(content);
//     window.location = "data:application/zip;base64," + content;
//   })
