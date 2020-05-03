module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "4b87c236aef6867f33c7";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n// __ts-babel@6.0.4\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixtQkFBTyxDQUFDLDBGQUEwQzs7QUFFbEQ7O0FBRUE7QUFDQTtBQUNBLENBQUM7OztBQUdELGtCQUFrQixtQkFBTyxDQUFDLDBHQUFrRCxZQUFZOzs7QUFHeEY7QUFDQSxTQUFTLHVCQUFnQjtBQUN6QixDQUFDLEU7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8gX190cy1iYWJlbEA2LjAuNFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar electron_1 = __webpack_require__(/*! electron */ \"electron\");\nvar path = __importStar(__webpack_require__(/*! path */ \"path\"));\nvar url_1 = __webpack_require__(/*! url */ \"url\");\nvar express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nvar isDevelopment = \"development\" !== 'production';\n// global reference to mainWindow (necessary to prevent window from being garbage collected)\nvar mainWindow;\nfunction createMainWindow() {\n    var window = new electron_1.BrowserWindow({\n        width: 800,\n        height: 600,\n        webPreferences: {\n            nodeIntegration: true,\n            plugins: true\n        }\n    });\n    if (isDevelopment) {\n        window.webContents.openDevTools();\n    }\n    if (isDevelopment) {\n        window.loadURL(\"http://localhost:\" + process.env.ELECTRON_WEBPACK_WDS_PORT);\n    }\n    else {\n        window.loadURL(url_1.format({\n            pathname: path.join(__dirname, 'index.html'),\n            protocol: 'file',\n            slashes: true\n        }));\n    }\n    window.on('closed', function () {\n        mainWindow = null;\n    });\n    window.webContents.on('devtools-opened', function () {\n        window.focus();\n        setImmediate(function () {\n            window.focus();\n        });\n    });\n    return window;\n}\n// quit application when all windows are closed\nelectron_1.app.on('window-all-closed', function () {\n    // on macOS it is common for applications to stay open until the user explicitly quits\n    if (process.platform !== 'darwin') {\n        electron_1.app.quit();\n    }\n});\nelectron_1.app.on('activate', function () {\n    // on macOS it is common to re-create a window even after all windows have been closed\n    if (mainWindow === null) {\n        mainWindow = createMainWindow();\n    }\n});\n// create main BrowserWindow when electron is ready\nelectron_1.app.on('ready', function () {\n    mainWindow = createMainWindow();\n});\n//https://github.com/stomita/electron-salesforce-oauth2-example/blob/master/src/renderer.js\n/**\n * Start express HTTP server and listen on the specified redirect URL\n */\nfunction waitCallback(redirectUri, state, timeout) {\n    if (timeout === void 0) { timeout = -1; }\n    return __awaiter(this, void 0, void 0, function () {\n        var _a, protocol, hostname, port, pathname;\n        var _this = this;\n        return __generator(this, function (_b) {\n            _a = url_1.parse(redirectUri), protocol = _a.protocol, hostname = _a.hostname, port = _a.port, pathname = _a.pathname;\n            if (protocol !== 'http:' || hostname !== 'localhost') {\n                throw new Error('redirectUri should be an http://localhost url');\n            }\n            return [2 /*return*/, new Promise(function (resolve, reject) {\n                    var callbackApp = express_1.default();\n                    callbackApp.get(pathname, function (req, res) { return __awaiter(_this, void 0, void 0, function () {\n                        return __generator(this, function (_a) {\n                            if (req.query.state !== state) {\n                                resolve(null);\n                                res.send('<html><body>failed: invalid state <script>window.close()</script></body></html>');\n                            }\n                            resolve(req.query);\n                            res.send('<html><body>success <script>window.close()</script></body></html>');\n                            setTimeout(shutdown, 100);\n                            return [2 /*return*/];\n                        });\n                    }); });\n                    var server = callbackApp.listen(port);\n                    var shutdown = function (reason) {\n                        server.close();\n                        if (reason) {\n                            reject(new Error(reason));\n                        }\n                    };\n                    if (timeout >= 0) {\n                        setTimeout(function () { return shutdown('timeout'); }, timeout);\n                    }\n                })];\n        });\n    });\n}\nexports.waitCallback = waitCallback;\n\n/* WEBPACK VAR INJECTION */}.call(this, \"src/main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC50cz8wNWI2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlEQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixpRUFBNkM7QUFDN0MsaUVBQTRCO0FBQzVCLGtEQUFnRDtBQUNoRCwrRUFBNkI7QUFFN0IsSUFBTSxhQUFhLEdBQUcsYUFBb0IsS0FBSyxZQUFZO0FBRTNELDRGQUE0RjtBQUM1RixJQUFJLFVBQVU7QUFFZCxTQUFTLGdCQUFnQjtJQUNyQixJQUFNLE1BQU0sR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDN0IsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNaLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLE9BQU8sRUFBRSxJQUFJO1NBQ2hCO0tBQ0osQ0FBQztJQUVGLElBQUksYUFBYSxFQUFFO1FBQ2YsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7S0FDcEM7SUFFRCxJQUFJLGFBQWEsRUFBRTtRQUNmLE1BQU0sQ0FBQyxPQUFPLENBQUMsc0JBQW9CLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQTJCLENBQUM7S0FDOUU7U0FDSTtRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBUyxDQUFDO1lBQ3JCLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUM7WUFDNUMsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLElBQUk7U0FDaEIsQ0FBQyxDQUFDO0tBQ047SUFFRCxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUNoQixVQUFVLEdBQUcsSUFBSTtJQUNyQixDQUFDLENBQUM7SUFFRixNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtRQUNyQyxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2QsWUFBWSxDQUFDO1lBQ1QsTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNsQixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7SUFFRixPQUFPLE1BQU07QUFDakIsQ0FBQztBQUVELCtDQUErQztBQUMvQyxjQUFHLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFO0lBQ3hCLHNGQUFzRjtJQUN0RixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQy9CLGNBQUcsQ0FBQyxJQUFJLEVBQUU7S0FDYjtBQUNMLENBQUMsQ0FBQztBQUVGLGNBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQ2Ysc0ZBQXNGO0lBQ3RGLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtRQUNyQixVQUFVLEdBQUcsZ0JBQWdCLEVBQUU7S0FDbEM7QUFDTCxDQUFDLENBQUM7QUFFRixtREFBbUQ7QUFDbkQsY0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7SUFDWixVQUFVLEdBQUcsZ0JBQWdCLEVBQUU7QUFDbkMsQ0FBQyxDQUFDO0FBRUYsMkZBQTJGO0FBQzNGOztHQUVHO0FBQ0gsU0FBc0IsWUFBWSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBWTtJQUFaLHFDQUFXLENBQUM7Ozs7O1lBQ3pELEtBQXlDLFdBQUssQ0FBQyxXQUFXLENBQUMsRUFBekQsUUFBUSxnQkFBRSxRQUFRLGdCQUFFLElBQUksWUFBRSxRQUFRLGVBQXdCO1lBQ2xFLElBQUksUUFBUSxLQUFLLE9BQU8sSUFBSSxRQUFRLEtBQUssV0FBVyxFQUFFO2dCQUNwRCxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7YUFDbEU7WUFDRCxzQkFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO29CQUNqQyxJQUFNLFdBQVcsR0FBRyxpQkFBTyxFQUFFLENBQUM7b0JBQzlCLFdBQVcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLEdBQUc7OzRCQUN2QyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBQztnQ0FDMUIsT0FBTyxDQUFDLElBQUksQ0FBQztnQ0FDYixHQUFHLENBQUMsSUFBSSxDQUFDLGlGQUFpRixDQUFDOzZCQUM5Rjs0QkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLG1FQUFtRSxDQUFDLENBQUM7NEJBQzlFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDOzs7eUJBQzFCLENBQUMsQ0FBQztvQkFDSCxJQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN4QyxJQUFNLFFBQVEsR0FBRyxVQUFDLE1BQU07d0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDZixJQUFJLE1BQU0sRUFBRTs0QkFDVixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt5QkFDM0I7b0JBQ0gsQ0FBQyxDQUFDO29CQUNGLElBQUksT0FBTyxJQUFJLENBQUMsRUFBRTt3QkFDaEIsVUFBVSxDQUFDLGNBQU0sZUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFuQixDQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO3FCQUNoRDtnQkFDSCxDQUFDLENBQUMsRUFBQzs7O0NBQ0o7QUEzQkgsb0NBMkJHIiwiZmlsZSI6Ii4vc3JjL21haW4vaW5kZXgudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBmb3JtYXQgYXMgZm9ybWF0VXJsLCBwYXJzZSB9IGZyb20gJ3VybCdcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5cbmNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nXG5cbi8vIGdsb2JhbCByZWZlcmVuY2UgdG8gbWFpbldpbmRvdyAobmVjZXNzYXJ5IHRvIHByZXZlbnQgd2luZG93IGZyb20gYmVpbmcgZ2FyYmFnZSBjb2xsZWN0ZWQpXG5sZXQgbWFpbldpbmRvd1xuXG5mdW5jdGlvbiBjcmVhdGVNYWluV2luZG93KCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgICAgICBwbHVnaW5zOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKGlzRGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgd2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpXG4gICAgfVxuXG4gICAgaWYgKGlzRGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgd2luZG93LmxvYWRVUkwoYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5FTEVDVFJPTl9XRUJQQUNLX1dEU19QT1JUfWApXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9hZFVSTChmb3JtYXRVcmwoe1xuICAgICAgICAgICAgcGF0aG5hbWU6IHBhdGguam9pbihfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXG4gICAgICAgICAgICBwcm90b2NvbDogJ2ZpbGUnLFxuICAgICAgICAgICAgc2xhc2hlczogdHJ1ZVxuICAgICAgICB9KSlcbiAgICB9XG5cbiAgICB3aW5kb3cub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgbWFpbldpbmRvdyA9IG51bGxcbiAgICB9KVxuXG4gICAgd2luZG93LndlYkNvbnRlbnRzLm9uKCdkZXZ0b29scy1vcGVuZWQnLCAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5mb2N1cygpXG4gICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cuZm9jdXMoKVxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gd2luZG93XG59XG5cbi8vIHF1aXQgYXBwbGljYXRpb24gd2hlbiBhbGwgd2luZG93cyBhcmUgY2xvc2VkXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xuICAgIC8vIG9uIG1hY09TIGl0IGlzIGNvbW1vbiBmb3IgYXBwbGljYXRpb25zIHRvIHN0YXkgb3BlbiB1bnRpbCB0aGUgdXNlciBleHBsaWNpdGx5IHF1aXRzXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgICAgIGFwcC5xdWl0KClcbiAgICB9XG59KVxuXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuICAgIC8vIG9uIG1hY09TIGl0IGlzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgZXZlbiBhZnRlciBhbGwgd2luZG93cyBoYXZlIGJlZW4gY2xvc2VkXG4gICAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpIHtcbiAgICAgICAgbWFpbldpbmRvdyA9IGNyZWF0ZU1haW5XaW5kb3coKVxuICAgIH1cbn0pXG5cbi8vIGNyZWF0ZSBtYWluIEJyb3dzZXJXaW5kb3cgd2hlbiBlbGVjdHJvbiBpcyByZWFkeVxuYXBwLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICBtYWluV2luZG93ID0gY3JlYXRlTWFpbldpbmRvdygpXG59KVxuXG4vL2h0dHBzOi8vZ2l0aHViLmNvbS9zdG9taXRhL2VsZWN0cm9uLXNhbGVzZm9yY2Utb2F1dGgyLWV4YW1wbGUvYmxvYi9tYXN0ZXIvc3JjL3JlbmRlcmVyLmpzXG4vKipcbiAqIFN0YXJ0IGV4cHJlc3MgSFRUUCBzZXJ2ZXIgYW5kIGxpc3RlbiBvbiB0aGUgc3BlY2lmaWVkIHJlZGlyZWN0IFVSTFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdENhbGxiYWNrKHJlZGlyZWN0VXJpLCBzdGF0ZSwgdGltZW91dCA9IC0xKSB7XG4gICAgY29uc3QgeyBwcm90b2NvbCwgaG9zdG5hbWUsIHBvcnQsIHBhdGhuYW1lIH0gPSBwYXJzZShyZWRpcmVjdFVyaSk7XG4gICAgaWYgKHByb3RvY29sICE9PSAnaHR0cDonIHx8IGhvc3RuYW1lICE9PSAnbG9jYWxob3N0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWRpcmVjdFVyaSBzaG91bGQgYmUgYW4gaHR0cDovL2xvY2FsaG9zdCB1cmwnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrQXBwID0gZXhwcmVzcygpO1xuICAgICAgY2FsbGJhY2tBcHAuZ2V0KHBhdGhuYW1lLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgaWYgKHJlcS5xdWVyeS5zdGF0ZSAhPT0gc3RhdGUpe1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgcmVzLnNlbmQoJzxodG1sPjxib2R5PmZhaWxlZDogaW52YWxpZCBzdGF0ZSA8c2NyaXB0PndpbmRvdy5jbG9zZSgpPC9zY3JpcHQ+PC9ib2R5PjwvaHRtbD4nKVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUocmVxLnF1ZXJ5KTtcbiAgICAgICAgcmVzLnNlbmQoJzxodG1sPjxib2R5PnN1Y2Nlc3MgPHNjcmlwdD53aW5kb3cuY2xvc2UoKTwvc2NyaXB0PjwvYm9keT48L2h0bWw+Jyk7XG4gICAgICAgIHNldFRpbWVvdXQoc2h1dGRvd24sIDEwMClcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2VydmVyID0gY2FsbGJhY2tBcHAubGlzdGVuKHBvcnQpO1xuICAgICAgY29uc3Qgc2h1dGRvd24gPSAocmVhc29uKSA9PiB7XG4gICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihyZWFzb24pKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmICh0aW1lb3V0ID49IDApIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzaHV0ZG93bigndGltZW91dCcpLCB0aW1lb3V0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/index.ts\n");

/***/ }),

/***/ 0:
/*!************************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./src/main/index.ts ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /home/m77/electron-sandbox/react/node_modules/electron-webpack/out/electron-main-hmr/main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
module.exports = __webpack_require__(/*! /home/m77/electron-sandbox/react/src/main/index.ts */"./src/main/index.ts");


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCI/MjJmZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJleHByZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///express\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIj82MWU4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///url\n");

/***/ })

/******/ });