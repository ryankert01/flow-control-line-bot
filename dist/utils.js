"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlace = exports.updateTraffic = exports.getTraffic = exports.getPlaces = exports.updateUser2 = exports.updateUser = exports.add_user = void 0;
function add_user(id, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        const lineUserId = id;
        // Returns an object or null
        var getUser = yield prisma.user.findUnique({
            where: {
                lineId: lineUserId,
            },
        });
        if (!getUser) {
            const user = yield prisma.user.create({
                data: {
                    lineId: lineUserId,
                },
            });
            console.log(user);
        }
        else {
            console.log('User already exists');
            console.log(getUser);
        }
        getUser = yield prisma.user.findUnique({
            where: {
                lineId: lineUserId,
            },
        });
        return getUser;
    });
}
exports.add_user = add_user;
function updateUser(lineId, preferredPlace, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedUser = yield prisma.user.update({
                where: {
                    lineId: lineId,
                },
                data: {
                    prefered_place: preferredPlace,
                },
            });
            console.log('User updated:', updatedUser);
        }
        catch (error) {
            console.error('Error updating user:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.updateUser = updateUser;
function updateUser2(lineId, evacuationPlace, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedUser = yield prisma.user.update({
                where: {
                    lineId: lineId,
                },
                data: {
                    evacuation_place: evacuationPlace,
                },
            });
            console.log('User updated:', updatedUser);
        }
        catch (error) {
            console.error('Error updating user:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.updateUser2 = updateUser2;
// updateTrafic
function updateTraffic(id, chosen_Users_number, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedTraffic = yield prisma.traffic.update({
                where: {
                    id: id,
                },
                data: {
                    chosen_Users_number: chosen_Users_number,
                },
            });
            console.log('Traffic updated:', updatedTraffic);
        }
        catch (error) {
            console.error('Error updating traffic:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.updateTraffic = updateTraffic;
// updatePlace
function updatePlace(id, chosen_Users_number, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedPlace = yield prisma.places.update({
                where: {
                    id: id,
                },
                data: {
                    chosen_Users_number: chosen_Users_number,
                },
            });
            console.log('Place updated:', updatedPlace);
        }
        catch (error) {
            console.error('Error updating place:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.updatePlace = updatePlace;
// pull all Places from database and convert them as json
function getPlaces(prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        const places = yield prisma.Places.findMany();
        return places;
    });
}
exports.getPlaces = getPlaces;
// pull all Traffic from database and convert them as json
function getTraffic(prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        const traffic = yield prisma.Traffic.findMany();
        return traffic;
    });
}
exports.getTraffic = getTraffic;
