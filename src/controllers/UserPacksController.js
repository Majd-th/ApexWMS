import { validationResult } from "express-validator";

export class UserPacksController {
    constructor(UserPacksService) {
        this.UserPacksService = UserPacksService;

        // Bind methods to avoid losing "this"
        this.list = this.list.bind(this);
        this.getByUserId = this.getByUserId.bind(this);
        this.create = this.create.bind(this);
        this.checkOwnership = this.checkOwnership.bind(this);
    }

    // --------------------
    // HELPER VALIDATION
    // --------------------
    _validate(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return true; // validation failed
        }
        return false; // OK
    }

    // --------------------
    // GET all user-pack records
    // --------------------
    async list(req, res, next) {
        try {
            const result = await this.UserPacksService.getUserPacks();
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    // --------------------
    // GET all packs for a specific user
    // --------------------
    async getByUserId(req, res, next) {
        try {
            if (this._validate(req, res)) return;

            const { user_id } = req.params;
            const data = await this.UserPacksService.getUserPacksByUserId(user_id);

            if (!data) {
                return res.status(404).json({ message: "User has no packs" });
            }

            res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    // --------------------
    // CREATE a user-pack relation
    // --------------------
    async create(req, res, next) {
        try {
            const newRecord = await this.UserPacksService.addUserPack(req.body);
            res.status(201).json(newRecord);
        } catch (e) {
            next(e);
        }
    }

    // --------------------
    // CHECK if user owns a pack
    // --------------------
    async checkOwnership(req, res, next) {
        try {
            if (this._validate(req, res)) return;

            const { user_id, pack_id } = req.params;

            const owns = await this.UserPacksService.checkUserOwnsPack(user_id, pack_id);

            res.status(200).json({ ownsPack: owns });
        } catch (e) {
            next(e);
        }
    }
}