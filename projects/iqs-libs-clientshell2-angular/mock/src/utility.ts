import {
    Application,
    ControlObject,
    EmergencyPlan,
    ObjectGroup,
    ObjectState,
    Session,
    Organization,
    User,
    Zone
} from 'iqs-libs-clientshell2-angular';
import { cloneDeep, find, findIndex, merge, random, sample, sampleSize } from 'lodash';
import * as moment_ from 'moment';

import {
    applications as storedApplications,
    emergencyPlans as storedEmergencyPlans,
    sessions as storedSessions,
    organizations as storedOrganizations,
    users as storedUsers,
    userOrganizations as storedUserOrganizations,
    controlObjects as storedObjects,
    objectGroups as storedObjectGroups,
    zones as storedZones,
    currentObjectStates as StoredCurrentObjectStates
} from './storage';

let lastUserId = storedUsers.length ? Number(storedUsers[storedUsers.length - 1].id) : 0;
let lastSessionId = storedSessions.length ? Number(storedSessions[storedSessions.length - 1].id) : 0;
let lastOrganizationId = storedOrganizations.length ? Number(storedOrganizations[storedOrganizations.length - 1].id) : 0;
let lastEmergencyPlanId = storedEmergencyPlans.length ? Number(storedEmergencyPlans[storedEmergencyPlans.length - 1].id) : 0;
let lastControlObjectId = storedObjects.length ? parseInt(storedObjects[storedObjects.length - 1].id, 16) : 0;
let lastObjectGroupId = storedObjectGroups.length ? parseInt(storedObjectGroups[storedObjectGroups.length - 1].id, 16) : 0;
let lastZoneId = storedZones.length ? parseInt(storedZones[storedZones.length - 1].id, 16) : 0;
const moment = moment_;

export const applications = {
    find: (id: string): Application => {
        return find(storedApplications, ['id', id]);
    },
    create: (app: Application): Application => {
        if (applications.find(app.id)) { return null; }
        storedApplications.push(app);
        localStorage.setItem('mockApplications', JSON.stringify(storedApplications));
        return app;
    },
    update: (app: Application): Application => {
        const idx = findIndex(storedApplications, ['id', app.id]);
        if (idx < 0) { return null; }
        storedApplications[idx] = app;
        localStorage.setItem('mockApplications', JSON.stringify(storedApplications));
        return app;
    },
    delete: (app: Application | string): boolean => {
        const aid = typeof app === 'string' ? app : app.id;
        const idx = findIndex(storedApplications, ['id', aid]);
        if (idx < 0) { return false; }
        storedApplications.splice(idx, 1);
        localStorage.setItem('mockApplications', JSON.stringify(storedApplications));
        return true;
    }
};

export const users = {
    find: (login: string): User | null => {
        let user: User = find(storedUsers, ['login', login]);
        if (!user) {
            user = find(storedUsers, ['email', login]);
        }
        if (!user) {
            user = find(storedUsers, ['id', login]);
        }
        return user;
    },
    create: (user: User): User => {
        lastUserId++;
        user.id = lastUserId.toString().padStart(32, '0');
        userOrganizations.initForUser(user.id);
        user.theme = user.theme || 'pip-blue-theme';
        user.language = user.language || 'en';
        if (!user.settings) { user.settings = {}; }
        if (!user.settings['menu_mode']) { user.settings['menu_mode'] = 'all'; }
        if (!user.settings['organization_id']) { user.settings['organization_id'] = sample(userOrganizations.find(user.id)).id; }
        storedUsers.push(user);
        localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
        const ret: User = cloneDeep(user);
        delete ret.password;
        return ret;
    },
    update: (id: string, user: User): User | null => {
        const idx = findIndex(storedUsers, ['id', id]);
        if (idx < 0) { return null; }
        const userToSave = cloneDeep(user);
        delete userToSave.id;
        storedUsers[idx] = merge({}, storedUsers[idx], userToSave);
        localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
        const ret: User = cloneDeep(storedUsers[idx]);
        delete ret.password;
        return ret;
    },
    delete: (login: string | User): User | null => {
        const l = typeof login === 'string' ? login : login.login;
        const user = users.find(l);
        if (!l) { return null; }
        const idx = findIndex(storedUsers, ['id', user.id]);
        if (idx < 0) { return null; }
        const ret = storedUsers.splice(idx, 1)[0];
        localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
        delete ret.password;
        return ret;
    }
};

export const sessions = {
    find: (session_id: string): Session | null => {
        return find(storedSessions, ['id', session_id]);
    },
    findByUser: (user_id: string): Session[] => {
        return storedSessions.filter(s => s.user_id === user_id);
    },
    create: (user: User): Session => {
        lastSessionId++;
        const s: Session = {
            'user_id': user.id,
            'user_name': user.name,
            'address': '109.254.254.40',
            'client': 'chrome',
            'user': {
                'change_pwd_time': null,
                'settings': user.settings || {},
                'organizations': [
                    {
                        'id': '00000000000000000000000000000000',
                        'name': 'Mock organization'
                    }
                ],
                'roles': [
                    '00000000000000000000000000000000:admin',
                    'admin'
                ],
                'theme': 'iqt-main',
                'language': 'en',
                'time_zone': null,
                'create_time': new Date(),
                'login': user.login,
                'name': user.name,
                'id': user.id
            },
            'data': null,
            'request_time': new Date(),
            'open_time': new Date(),
            'close_time': null,
            'active': true,
            'id': lastSessionId.toString().padStart(32, '0')
        };
        storedSessions.push(s);
        localStorage.setItem('mockSessions', JSON.stringify(storedSessions));
        return s;
    },
    createClosed: (user: User): Session => {
        lastSessionId++;
        const s: Session = {
            'user_id': user.id,
            'user_name': user.name,
            'address': '109.254.254.40',
            'client': 'chrome',
            'user': {
                'change_pwd_time': null,
                'settings': user.settings || {},
                'organizations': [
                    {
                        'id': '00000000000000000000000000000000',
                        'name': 'Mock organization'
                    }
                ],
                'roles': [
                    '00000000000000000000000000000000:admin',
                    'admin'
                ],
                'theme': 'iqt-main',
                'language': 'en',
                'time_zone': null,
                'create_time': new Date(),
                'login': user.login,
                'name': user.name,
                'id': user.id
            },
            'data': null,
            'request_time': new Date(),
            'open_time': moment().subtract(2, 'd').toDate(),
            'close_time': moment().subtract(1, 'd').toDate(),
            'active': false,
            'id': lastSessionId.toString().padStart(32, '0')
        };
        storedSessions.push(s);
        localStorage.setItem('mockSessions', JSON.stringify(storedSessions));
        return s;
    },
    close: (session_id: string): boolean => {
        const idx = findIndex(storedSessions, ['id', session_id]);
        if (idx < 0) { return false; }
        storedSessions[idx].active = false;
        storedSessions[idx].close_time = new Date();
        localStorage.setItem('mockSessions', JSON.stringify(storedSessions));
        return true;
    },
    closeAll: (user_id: string): number => {
        const userActiveSessions = sessions.findByUser(user_id).filter(s => s.active);
        for (let idx = 0; idx < userActiveSessions.length; idx++) {
            userActiveSessions[idx].active = false;
            userActiveSessions[idx].close_time = new Date();
        }
        localStorage.setItem('mockSessions', JSON.stringify(storedSessions));
        return userActiveSessions.length;
    }
};

export const organizations = {
    find: (predicate: string): Organization[] => {
        const rx = new RegExp(predicate, 'i');
        return storedOrganizations.filter(organization => organization.name.match(rx) || organization.code.match(rx));
    },
    create: (organization: Organization, creator: User): Organization => {
        if (organization.id) { delete organization.id; }
        lastOrganizationId++;
        organization.id = lastOrganizationId.toString().padStart(32, '0');
        organization.code = Array(8).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
        organization.create_time = new Date();
        organization.creator_id = creator.id;
        storedOrganizations.push(organization);
        localStorage.setItem('mockOrganizations', JSON.stringify(storedOrganizations));
        return organization;
    }
};

export const userOrganizations = {
    initForUser: (user_id: string) => {
        storedUserOrganizations.push({
            user_id: user_id,
            organization_ids: sampleSize(storedOrganizations, random(1, storedOrganizations.length - 1))
                .map((organization: Organization) => organization.id)
        });
        localStorage.setItem('mockUserOrganizations', JSON.stringify(storedUserOrganizations));
    },
    collectOrganizations: (organization_ids: string[]): Organization[] => {
        const s = [];
        for (const organization_id of organization_ids) {
            const organization = find(storedOrganizations, ['id', organization_id]);
            if (organization) {
                s.push(organization);
            }
        }
        return s;
    },
    find: (user_id: string): Organization[] => {
        let idx = findIndex(storedUserOrganizations, ['user_id', user_id]);
        if (idx < 0) {
            userOrganizations.initForUser(user_id);
            idx = storedUserOrganizations.length - 1;
        }
        return userOrganizations.collectOrganizations(storedUserOrganizations[idx].organization_ids);
    },
    connect: (user_id: string, organization_id: string): Organization | number => {
        let idx = findIndex(storedUserOrganizations, ['user_id', user_id]);
        if (idx < 0) {
            userOrganizations.initForUser(user_id);
            idx = storedUserOrganizations.length - 1;
        }
        const organization = find(storedOrganizations, ['id', organization_id]);
        if (!organization) { return 1; }
        if (storedUserOrganizations[idx].organization_ids.includes(organization_id)) { return 0; }
        storedUserOrganizations[idx].organization_ids.push(organization_id);
        localStorage.setItem('mockUserOrganizations', JSON.stringify(storedUserOrganizations));
        return organization;
    },
    disconnect: (user_id: string, organization_id: string): Organization | number => {
        let idx = findIndex(storedUserOrganizations, ['user_id', user_id]);
        if (idx < 0) {
            userOrganizations.initForUser(user_id);
            idx = storedUserOrganizations.length - 1;
        }
        const organization = find(storedOrganizations, ['id', organization_id]);
        if (!organization) { return 1; }
        const sidx = storedUserOrganizations[idx].organization_ids.indexOf(organization_id);
        if (sidx < 0) { return 0; }
        const user: any = find(storedUsers, ['id', user_id]);
        if (user && user.settings.organization_id === organization_id) { return 2; }
        storedUserOrganizations[idx].organization_ids.splice(sidx, 1);
        localStorage.setItem('mockUserOrganizations', JSON.stringify(storedUserOrganizations));
        return organization;
    },
};

export const emergencyPlans = {
    findByOrganizationId: (organization_id: string): EmergencyPlan[] => {
        return storedEmergencyPlans.filter(ep => ep.organization_id === organization_id);
    },
    findById: (id: string): EmergencyPlan => {
        return find(storedEmergencyPlans, ['id', id]);
    },
    create: (plan: EmergencyPlan): EmergencyPlan => {
        lastEmergencyPlanId++;
        plan.id = lastEmergencyPlanId.toString().padStart(32, '0');
        storedEmergencyPlans.push(plan);
        localStorage.setItem('mockEmergencyPlans', JSON.stringify(storedEmergencyPlans));
        return plan;
    },
    update: (id: string, planToSave: EmergencyPlan): EmergencyPlan => {
        const idx = findIndex(storedEmergencyPlans, ['id', id]);
        if (idx < 0) { return null; }
        storedEmergencyPlans[idx] = merge({}, storedEmergencyPlans[idx], planToSave);
        localStorage.setItem('mockEmergencyPlans', JSON.stringify(storedEmergencyPlans));
        return storedEmergencyPlans[idx];
    },
    delete: (id: string): EmergencyPlan => {
        const idx = findIndex(storedEmergencyPlans, ['id', id]);
        if (idx < 0) { return null; }
        const removed: EmergencyPlan = storedEmergencyPlans.splice(idx, 1)[0];
        localStorage.setItem('mockEmergencyPlans', JSON.stringify(storedEmergencyPlans));
        return removed;
    },
};

export const objects = {
    findByOrganizationId: (organization_id: string): ControlObject[] => {
        return storedObjects.filter(o => o.organization_id === organization_id);
    },
    findById: (id: string): ControlObject => {
        return find(storedObjects, ['id', id]);
    },
    create: (ob: ControlObject): ControlObject => {
        lastControlObjectId++;
        ob.id = lastControlObjectId.toString(16).padStart(32, '0');
        storedObjects.push(ob);
        localStorage.setItem('mockControlObjects', JSON.stringify(storedObjects));
        return ob;
    },
    update: (id: string, ob: ControlObject): ControlObject => {
        const idx = findIndex(storedObjects, ['id', id]);
        if (idx < 0) { return null; }
        storedObjects[idx] = merge({}, storedObjects[idx], ob);
        localStorage.setItem('mockControlObjects', JSON.stringify(storedObjects));
        return storedObjects[idx];
    },
    delete: (id: string): ControlObject => {
        const idx = findIndex(storedObjects, ['id', id]);
        if (idx < 0) { return null; }
        const removed: ControlObject = storedObjects.splice(idx, 1)[0];
        localStorage.setItem('mockControlObjects', JSON.stringify(storedObjects));
        return removed;
    },
};

export const objectGroups = {
    findByOrganizationId: (organization_id: string): ObjectGroup[] => {
        return storedObjectGroups.filter(o => o.organization_id === organization_id);
    },
    findById: (id: string): ObjectGroup => {
        return find(storedObjectGroups, ['id', id]);
    },
    create: (og: ObjectGroup): ObjectGroup => {
        lastObjectGroupId++;
        og.id = lastObjectGroupId.toString(16).padStart(32, '0');
        storedObjectGroups.push(og);
        localStorage.setItem('mockObjectGroups', JSON.stringify(storedObjectGroups));
        return og;
    },
    update: (id: string, ob: ObjectGroup): ObjectGroup => {
        const idx = findIndex(storedObjectGroups, ['id', id]);
        if (idx < 0) { return null; }
        storedObjectGroups[idx] = merge({}, storedObjectGroups[idx], ob);
        localStorage.setItem('mockObjectGroups', JSON.stringify(storedObjectGroups));
        return storedObjectGroups[idx];
    },
    delete: (id: string): ObjectGroup => {
        const idx = findIndex(storedObjectGroups, ['id', id]);
        if (idx < 0) { return null; }
        const removed: ObjectGroup = storedObjectGroups.splice(idx, 1)[0];
        localStorage.setItem('mockObjectGroups', JSON.stringify(storedObjectGroups));
        return removed;
    },
};

export const zones = {
    findByOrganizationId: (organization_id: string): Zone[] => {
        return storedZones.filter(o => o.organization_id === organization_id);
    },
    findById: (id: string): Zone => {
        return find(storedZones, ['id', id]);
    },
    create: (og: Zone): Zone => {
        lastZoneId++;
        og.id = lastZoneId.toString(16).padStart(32, '0');
        storedZones.push(og);
        localStorage.setItem('mockZones', JSON.stringify(storedZones));
        return og;
    },
    update: (id: string, ob: Zone): Zone => {
        const idx = findIndex(storedZones, ['id', id]);
        if (idx < 0) { return null; }
        storedZones[idx] = merge({}, storedZones[idx], ob);
        localStorage.setItem('mockZones', JSON.stringify(storedZones));
        return storedZones[idx];
    },
    delete: (id: string): Zone => {
        const idx = findIndex(storedZones, ['id', id]);
        if (idx < 0) { return null; }
        const removed: Zone = storedZones.splice(idx, 1)[0];
        localStorage.setItem('mockZones', JSON.stringify(storedZones));
        return removed;
    },
};

export const currentObjectStates = {
    findByOrganizationId: (organization_id: string): ObjectState[] => {
        return StoredCurrentObjectStates.filter(o => o.organization_id === organization_id);
    },
    findById: (id: string): ObjectState => {
        return find(StoredCurrentObjectStates, ['id', id]);
    }
};
